import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy, 
  getDocs 
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "notifications";

export const notificationService = {
  // Get all notifications ordered by creation date (newest first)
  async getNotifications() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date object if needed, or keep as is
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Add a new notification
  async addNotification(title, content) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        title,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding notification:", error);
      throw error;
    }
  },

  // Update an existing notification
  async updateNotification(id, data) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  },

  // Delete a notification
  async deleteNotification(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
};
