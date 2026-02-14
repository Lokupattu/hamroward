import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";

/**
 * Check if a user has admin privileges
 * @param {string} userId - The user's UID
 * @returns {Promise<boolean>} - True if user is admin
 */
export async function isUserAdmin(userId) {
  if (!userId || !isFirebaseEnabled) return false;
  
  try {
    // Check 'users' collection for role 'admin'
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists() && userDoc.data()?.role === 'admin') {
      return true;
    }

    // Fallback: Check 'admins' collection (legacy or specific admin collection)
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    return adminDoc.exists() && adminDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
