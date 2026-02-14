import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";

export async function createSponsor(payload) {
  if (!db || !isFirebaseEnabled) {
    console.info("[HamroWard] Firestore disabled, returning mock sponsor payload.");
    return { id: crypto.randomUUID?.() ?? Date.now().toString(), ...payload };
  }
  const ref = await addDoc(collection(db, "sponsors"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...payload };
}

export async function updateSponsor(sponsorId, payload) {
  if (!db || !isFirebaseEnabled) {
    console.info("[HamroWard] Firestore disabled, skipping sponsor update.");
    return;
  }
  await setDoc(doc(db, "sponsors", sponsorId), {
    ...payload,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteSponsor(sponsorId) {
  if (!db || !isFirebaseEnabled) {
    console.info("[HamroWard] Firestore disabled, skipping sponsor delete.");
    return;
  }
  await deleteDoc(doc(db, "sponsors", sponsorId));
}

