import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigDataRaw from '../../firebase-applet-config.json';

const firebaseConfigData = firebaseConfigDataRaw as any;

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseConfigData.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfigData.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfigData.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigData.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfigData.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseConfigData.firestoreDatabaseId,
};

// Check if all required config items are present
const isFirebaseConfigValid = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app;
let db: any = null;
let auth: any = null;
let isFirebaseAvailable = false;

if (isFirebaseConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const databaseId = import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;
    db = databaseId 
      ? getFirestore(app, databaseId)
      : getFirestore(app);
    auth = getAuth(app);
    isFirebaseAvailable = true;
    console.log('Firebase initialized successfully with configuration credentials.');
  } catch (err) {
    console.warn('Firebase initialization failed:', err);
    isFirebaseAvailable = false;
  }
} else {
  console.log('Firebase is not configured yet. Running in guest mode with localStorage fallback.');
}

export { db, auth, isFirebaseAvailable };
