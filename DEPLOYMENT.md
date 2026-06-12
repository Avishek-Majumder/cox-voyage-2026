# Cox Voyage 2026 — Deployment Guide

This guide details how to deploy the **Cox Voyage 2026** frontend applet onto hosting platforms like **Vercel** or **Netlify**, while keeping the Google Drive media gallery upload/download backend secure on an Express server (e.g., Google Cloud Run, Heroku, Render, etc.).

---

## 🏗️ Deployment Settings

* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Framework Preset:** `Vite` (or `Other` / manual fallback)

---

## 🚀 1. Deploying to Vercel

### Option A: Using the Vercel Dashboard (Recommended)

1. Sign in to [Vercel](https://vercel.com/) and click **New Project**.
2. Import your repository or upload the project ZIP folder.
3. Vercel automatically detects **Vite** as your framework:
   * **Build Command:** `npm run build` (or keep default `vite build`)
   * **Output Directory:** `dist` (or keep default `dist`)
4. Open the **Environment Variables** accordion and add all the required client-safe keys listed in the Section [Environment Variables](#-environment-variables).
5. Click **Deploy**.

### Option B: Using the Vercel CLI

1. Run the command to install Vercel CLI global: `npm install -g vercel`
2. Run `vercel login` and verify your identity.
3. In the project root, run:
   ```bash
   vercel
   ```
4. Follow the configuration prompts (select default settings and frame).
5. To deploy to production:
   ```bash
   vercel --prod
   ```

---

## ⚡ 2. Deploying to Netlify

### Option A: Using Netlify UI (Recommended)

1. Sign in to [Netlify](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Authorize and select your Git provider, then search for your repository.
3. Configure the Site Build Settings:
   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist`
4. Expand **Advanced build settings** and click **Environment variables**. Add all the keys in the Section [Environment Variables](#-environment-variables).
5. Click **Deploy Site**.

### Option B: Using Netlify CLI

1. Install the CLI: `npm install -g netlify-cli`
2. Authenticate: `netlify login`
3. Run initialization inside your repository root:
   ```bash
   netlify init
   ```
4. Build and deploy to production:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

## 🔒 Environment Variables

To protect your credentials and allow proper routing, configure the following variables in your hosting provider's dashboard. 

### ✅ Required Client-Safe Front-End Variables

| Name | Description | Example / Note |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase API client access key | `AIzaSyA...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain | `your-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firestore & Auth GCP Project | `your-app-id` |
| `VITE_FIRESTORE_DATABASE_ID` | Custom named Firestore Database ID | `ai-studio-0eb397ac-9921-401c-8c6a-a3bf570d1de9` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JS SDK Key | `AIzaSyB...` |
| `VITE_OPENWEATHER_API_KEY` | Live weather updates API Key | `13a...` |
| `VITE_GALLERY_API_BASE_URL` | Deployed backend URL (Cloud Run) | `https://your-backend-service-cloud-run.run.app` |

### ⛔ **NEVER** Expose on the Front-End (Vercel or Netlify)

The keys below contain sensitive permissions (e.g., service accounts, secrets) and **MUST NOT** be compiled into the static frontend bundle:

* `GOOGLE_SERVICE_ACCOUNT_EMAIL`
* `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
* `GOOGLE_DRIVE_REFRESH_TOKEN`
* `GOOGLE_DRIVE_CLIENT_SECRET`

**Keep these private parameters configured only on the server-side environment hosting the backend code.**

---

## 📋 Post-Deployment Checklist

Once your deploy is successful and you have your live application domain (e.g., `https://cox-voyage-2026.vercel.app` or `https://cox-voyage-2026.netlify.app`), complete the following manual wiring adjustments:

1. **Firebase Authorized Domains:**
   * Go to the Firebase Console > **Authentication** > **Settings** > **Authorized Domains**.
   * Add your deployed domains (both production and branch previews) so that Google Sign-in logins succeed without being blocked by cross-origin policies.
2. **Google Cloud Console OAuth Authorized Origins:**
   * Go to the [Google Cloud Console API Credentials](https://console.cloud.google.com/apis/credentials).
   * Edit your OAuth Client ID.
   * Add your deployed domain(s) under **Authorized JavaScript Origins**.
3. **Google Maps API Key Restrictions:**
   * Under the Google API Credentials screen, edit your Maps API Key.
   * Restrict usage to **Websites (HTTP referrers)** and add your deployed domain(s). This prevents unauthorized usage and keeps your billing completely safe!
4. **Backend CORS Setup:**
   * Ensure that your custom backend service configuration includes your newly deployed frontend domain in its CORS allowed origins so that file uploads and delete operations from the static client are authorized.
5. **Interactive Testing Run:**
   * **Google Sign-In:** Confirm that users can sign in out of the guest mode.
   * **Firestore Saving/Syncing:** Add a state change (e.g., change seat assignments) and confirm that changes successfully persist.
   * **Document Viewers:** Unveil individual ticket PDFs, hotel vouchers, and hotel invoices in the Modal viewers.
   * **Google Live Road Map:** Check that maps initialize correctly.
   * **Live OpenWeather Widget:** Ensure live temperatures of Cox's Bazar render successfully.
   * **Trip Gallery Media:**
     1. Test listing existing media items.
     2. Test uploading a file (image or video).
     3. Test downloading the uploaded file via the backend.
     4. Test deleting the uploaded file.
   * **Aesthetic Testing:** Check Dark mode, Light mode toggling, layout fluidities, and confirm that there is absolutely no horizontal overflow on mobile screen width touch targets!
