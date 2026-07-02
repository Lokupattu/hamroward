import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_VIDEOS = 'videos';
const COLLECTION_ISSUES = 'issues';
const COLLECTION_USERS = 'users';

// --- User Operations ---

export const getAllUsers = async () => {
  try {
    const q = collection(db, COLLECTION_USERS);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, isApproved) => {
  try {
    const docRef = doc(db, COLLECTION_USERS, userId);
    await updateDoc(docRef, {
      isApproved: isApproved,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// --- Video Operations ---

export const saveVideo = async (videoData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_VIDEOS), {
      ...videoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...videoData };
  } catch (error) {
    console.error("Error saving video to Firestore:", error);
    throw error;
  }
};

export const getVideo = async (videoId) => {
  try {
    const docRef = doc(db, COLLECTION_VIDEOS, videoId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting video from Firestore:", error);
    throw error;
  }
};

export const getAllVideos = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_VIDEOS);
    const constraints = [];

    if (filters.ward) {
      constraints.push(where("ward", "==", filters.ward));
    }
    
    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    // Default sort by createdAt desc
    // constraints.push(orderBy("createdAt", "desc")); // Commented out to avoid index issues

    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const videos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side sort
    return videos.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error getting videos from Firestore:", error);
    throw error;
  }
};

export const updateVideoStatus = async (videoId, status) => {
  try {
    const docRef = doc(db, COLLECTION_VIDEOS, videoId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating video status:", error);
    throw error;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    const docRef = doc(db, COLLECTION_VIDEOS, videoId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

// --- Issue Operations ---

export const saveIssue = async (issueData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_ISSUES), {
      ...issueData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending' // Default status
    });
    return { id: docRef.id, ...issueData };
  } catch (error) {
    console.error("Error saving issue:", error);
    throw error;
  }
};

export const getIssues = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_ISSUES);
    const constraints = [];

    if (filters.userId) {
      constraints.push(where("userId", "==", filters.userId));
    }
    
    if (filters.ward) {
      constraints.push(where("ward", "==", filters.ward));
    }

    // constraints.push(orderBy("createdAt", "desc")); // Commented out to avoid index issues

    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const issues = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return issues.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error getting issues:", error);
    throw error;
  }
};

export const updateIssueStatus = async (issueId, status) => {
  try {
    const docRef = doc(db, COLLECTION_ISSUES, issueId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating issue status:", error);
    throw error;
  }
};

export const updateIssue = async (issueId, data) => {
  try {
    const docRef = doc(db, COLLECTION_ISSUES, issueId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
};
export const deleteIssue = async (issueId) => {
  try {
    const docRef = doc(db, COLLECTION_ISSUES, issueId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
};
