import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";

export async function updateDocument(docId, payload) {
  if (!db || !isFirebaseEnabled) {
    console.info("[HamroWard] Firestore disabled, skipping document update.");
    return;
  }
  const docRef = doc(db, "documents", docId);
  await setDoc(docRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

