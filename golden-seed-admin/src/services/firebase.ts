import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCIh_0ReFnFG-SHnNh4wrrB9jcu8HFb3Ew",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "splendid-temple-qcf5x.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "splendid-temple-qcf5x",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "splendid-temple-qcf5x.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "684750266151",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:684750266151:web:708d3efc9c00a17e3a5302"
};

const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-goldenseed-9ce23e34-f920-41e5-80f4-20edcfe3e89c";

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
