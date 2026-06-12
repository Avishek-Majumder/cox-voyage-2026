import express from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Configure extremely generous body limits for parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Configure multer for memory storage with up to 10GB file limit as per requirements
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10 GB
  }
});

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "17nnXco5uEn-24_HQ80nb28H4YxLuhtTl";

let cachedAccessToken: string | null = null;
let tokenExpiryTime = 0;

async function getOrganizerAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const saPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Return cached token if still valid
  if (cachedAccessToken && Date.now() < tokenExpiryTime - 300000) {
    return cachedAccessToken;
  }

  // 1. Refresh Token Auth Flow
  if (refreshToken && clientId && clientSecret) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google OAuth refresh failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiryTime = Date.now() + (data.expires_in * 1000);
    return cachedAccessToken!;
  }

  // 2. Service Account JWT Flow
  if (saEmail && saPrivateKey) {
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const claimSet = JSON.stringify({
      iss: saEmail,
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    });
    const jwtClaim = Buffer.from(claimSet).toString('base64url');
    
    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${jwtHeader}.${jwtClaim}`);
    const signature = sign.sign(saPrivateKey, 'base64url');
    const jwt = `${jwtHeader}.${jwtClaim}.${signature}`;

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Service Account OAuth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiryTime = Date.now() + (data.expires_in * 1000);
    return cachedAccessToken!;
  }

  throw new Error("Google Drive storage backend is not configured with credentials in the environment.");
}

// 1. Core Health and Configuration Status Endpoint
app.get('/api/gallery/status', (req, res) => {
  const hasRefreshToken = Boolean(
    process.env.GOOGLE_DRIVE_REFRESH_TOKEN && 
    (process.env.GOOGLE_DRIVE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID) && 
    process.env.GOOGLE_DRIVE_CLIENT_SECRET
  );
  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );

  res.json({
    configured: hasRefreshToken || hasServiceAccount,
    provider: hasRefreshToken ? 'refresh_token' : hasServiceAccount ? 'service_account' : 'none'
  });
});

// 2. List Gallery Items Endpoint
app.get('/api/gallery/list', async (req, res) => {
  try {
    const token = await getOrganizerAccessToken();
    const qField = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent('files(id, name, mimeType, size, thumbnailLink, webContentLink, webViewLink, createdTime, description)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${qField}&fields=${fields}&orderBy=createdTime+desc`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Google Drive list API returned: ${response.status}`);
    }

    const data = await response.json();
    const driveFiles = data.files || [];

    const items = driveFiles
      .filter((file: any) => {
        const mime = file.mimeType || '';
        return (
          mime.startsWith('image/') || 
          mime.startsWith('video/') || 
          mime.includes('heic') || 
          mime.includes('heif')
        );
      })
      .map((file: any) => {
        const isPhoto = file.mimeType.startsWith('image/') || file.mimeType.includes('heic') || file.mimeType.includes('heif');
        let originalName = file.name;
        let uploadedByUid = "anonymous";
        let uploadedByName = "Guest User";
        let uploadedByEmail = "";
        
        try {
          if (file.description) {
            const descMeta = JSON.parse(file.description);
            if (descMeta.uploadedByUid) {
              uploadedByUid = descMeta.uploadedByUid;
              uploadedByName = descMeta.uploadedByName || "Cox Voyage Member";
              uploadedByEmail = descMeta.uploadedByEmail || "";
              originalName = descMeta.originalName || file.name;
            }
          }
        } catch (e) {
          // Silent fallback
        }

        return {
          id: file.id,
          driveFileId: file.id,
          name: file.name,
          originalName,
          type: isPhoto ? 'image' : 'video',
          mimeType: file.mimeType,
          size: Number(file.size || 0),
          thumbnailUrl: file.thumbnailLink || `https://drive.google.com/thumbnail?sz=w400&id=${file.id}`,
          previewUrl: `https://drive.google.com/thumbnail?sz=w1200&id=${file.id}`,
          downloadUrl: `/api/gallery/download/${file.id}`,
          webViewLink: file.webViewLink,
          createdTime: file.createdTime || new Date().toISOString(),
          uploadedByUid,
          uploadedByName,
          uploadedByEmail,
        };
      });

    res.json(items);
  } catch (err: any) {
    console.error("List Gallery Items Error:", err.message);
    res.status(503).json({ error: "Trip Gallery backend is not configured yet. Organizer setup is required before uploads can work.", details: err.message });
  }
});

// 3. Upload Gallery Media Endpoint
app.post('/api/gallery/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file included in upload request.' });
    }

    const token = await getOrganizerAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const cleanOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const driveFileName = `cox-voyage-2026-${timestamp}-${cleanOriginalName}`;

    const metadata = {
      name: driveFileName,
      parents: [folderId],
      mimeType: req.file.mimetype,
      description: JSON.stringify({
        originalName: req.file.originalname,
        uploadedByUid: req.body.uploadedByUid || 'anonymous',
        uploadedByName: req.body.uploadedByName || 'Cox Voyage Member',
        uploadedByEmail: req.body.uploadedByEmail || '',
      }),
    };

    const boundary = 'cox_voyage_boundary_' + Date.now();
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
    const mediaHeader = `${delimiter}Content-Type: ${req.file.mimetype}\r\n\r\n`;

    const payloadBuffer = Buffer.concat([
      Buffer.from(metadataPart, 'utf-8'),
      Buffer.from(mediaHeader, 'utf-8'),
      req.file.buffer,
      Buffer.from(closeDelim, 'utf-8'),
    ]);

    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': String(payloadBuffer.length),
      },
      body: payloadBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Google Upload failed with: ${uploadResponse.status} - ${errorText}`);
    }

    const driveResult = await uploadResponse.json();
    const driveFileId = driveResult.id;

    const isPhoto = req.file.mimetype.startsWith('image/') || req.file.mimetype.includes('heic') || req.file.mimetype.includes('heif');

    res.json({
      id: driveFileId,
      driveFileId,
      name: driveFileName,
      originalName: req.file.originalname,
      type: isPhoto ? 'image' : 'video',
      mimeType: req.file.mimetype,
      size: req.file.size,
      thumbnailUrl: `https://drive.google.com/thumbnail?sz=w400&id=${driveFileId}`,
      previewUrl: `https://drive.google.com/thumbnail?sz=w1200&id=${driveFileId}`,
      downloadUrl: `/api/gallery/download/${driveFileId}`,
      webViewLink: `https://drive.google.com/file/d/${driveFileId}/view`,
      createdTime: new Date().toISOString(),
      uploadedByUid: req.body.uploadedByUid || 'anonymous',
      uploadedByName: req.body.uploadedByName || 'Cox Voyage Member',
      uploadedByEmail: req.body.uploadedByEmail || '',
    });
  } catch (err: any) {
    console.error("Upload Media Error:", err.message);
    res.status(503).json({ error: "Trip Gallery backend is not configured yet. Organizer setup is required before uploads can work.", details: err.message });
  }
});

// 4. Proxy Stream Download Endpoint
app.get('/api/gallery/download/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const token = await getOrganizerAccessToken();
    
    // Fetch file headers first to pass exact size and type to browser
    const metaResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType,size`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    let fileName = fileId;
    let mimeType = 'application/octet-stream';
    let fileSize = '';
    
    if (metaResponse.ok) {
      const meta = await metaResponse.json();
      fileName = meta.name || fileId;
      mimeType = meta.mimeType || mimeType;
      fileSize = meta.size || '';
    }

    const driveResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!driveResponse.ok) {
      return res.status(driveResponse.status).send(`Failed to stream download file from Google Drive.`);
    }

    if (mimeType) res.setHeader('Content-Type', mimeType);
    if (fileSize) res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    const body = driveResponse.body;
    if (body) {
      const { Readable } = await import('stream');
      Readable.fromWeb(body as any).pipe(res);
    } else {
      res.status(404).send('No content stream found.');
    }
  } catch (err: any) {
    console.error("Proxy Download Error:", err.message);
    res.status(500).send("Internal download helper proxy error.");
  }
});

// 5. Trash/Delete Gallery File Endpoint
app.delete('/api/gallery/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const token = await getOrganizerAccessToken();

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trashed: true }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Trashing failed: ${errorText}` });
    }

    res.json({ success: true, fileId });
  } catch (err: any) {
    console.error("Trash Media Error:", err.message);
    res.status(503).json({ error: "Trip Gallery backend is not configured yet. Organizer setup is required before uploads can work.", details: err.message });
  }
});


// Express Vite middleware / static build server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cox Voyage Backend] Server started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
