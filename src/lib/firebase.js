import {
  getAuth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfigValues = Object.values(firebaseConfig);
export const isFirebaseEnabled = requiredConfigValues.every(Boolean);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseEnabled) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Ensure sessions persist across refreshes
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn("Failed to set auth persistence", error);
  });

  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
    const host = "127.0.0.1";
    connectAuthEmulator(auth, `http://${host}:9099`);
    connectFirestoreEmulator(db, host, 8080);
    connectStorageEmulator(storage, host, 9199);
  }
} else {
  console.info(
    "[HamroWard] Firebase config missing: falling back to local seed data. Add VITE_FIREBASE_* env vars to enable live data."
  );
}

export { app, auth, db, storage };

