import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";

// Fallback to localStorage comments key
const LOCAL_STORAGE_KEY = "hamroward_comments";

function getLocalComments() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read from localStorage", e);
    return [];
  }
}

function saveLocalComments(comments) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
}

export function subscribeComments(issueId, callback) {
  if (!isFirebaseEnabled || !db) {
    const fetchLocal = () => {
      const all = getLocalComments();
      const filtered = all.filter(c => c.issueId === issueId);
      // Sort oldest first (chronological)
      const sorted = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      callback(sorted);
    };

    fetchLocal();

    const handleStorageChange = (e) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        fetchLocal();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    
    const handleLocalUpdate = () => {
      fetchLocal();
    };
    window.addEventListener("hamroward_comments_updated", handleLocalUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("hamroward_comments_updated", handleLocalUpdate);
    };
  }

  // Firebase Live Subscription
  const q = query(
    collection(db, "comments"),
    where("issueId", "==", issueId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort oldest first (chronological) client-side to avoid index requirement
      const sorted = list.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateA - dateB;
      });
      callback(sorted);
    },
    (error) => {
      console.error("Error subscribing to comments:", error);
    }
  );
}

export async function addComment(issueId, text, parentId = null, profile) {
  if (!profile) {
    throw new Error("You must be logged in to comment.");
  }

  const commentData = {
    issueId,
    text,
    parentId,
    userId: profile.uid,
    userName: profile.name || "Citizen",
    userPhotoURL: profile.photoURL || null,
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseEnabled || !db) {
    const all = getLocalComments();
    const newComment = {
      id: "comment_" + Math.random().toString(36).substr(2, 9),
      ...commentData
    };
    all.push(newComment);
    saveLocalComments(all);
    window.dispatchEvent(new Event("hamroward_comments_updated"));
    return newComment;
  }

  try {
    const docRef = await addDoc(collection(db, "comments"), {
      ...commentData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...commentData };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}
