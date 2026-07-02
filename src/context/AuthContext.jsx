/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, isFirebaseEnabled } from "../lib/firebase";

const AuthContext = createContext(undefined);

function getFallbackProfile(user) {
  if (!user) return null;
  return {
    uid: user.uid,
    name: user.displayName ?? user.email?.split("@")[0],
    email: user.email,
    wardNumber: null,
    role: user.email?.endsWith("@ward.hamro") ? "admin" : "user",
    isApproved: user.email?.endsWith("@ward.hamro"), // Auto-approve if admin domain for fallback
    photoURL: user.photoURL ?? null,
  };
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setFirebaseUser(user);
        
        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        if (!db || !isFirebaseEnabled) {
          setProfile(getFallbackProfile(user));
          setLoading(false);
          return;
        }

        try {
          const docRef = doc(db, "users", user.uid);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setProfile({ uid: user.uid, ...snapshot.data() });
          } else {
            const fallback = getFallbackProfile(user);
            await setDoc(docRef, {
              ...fallback,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setProfile(fallback);
          }
        } catch (err) {
          console.error("Failed to load user profile", err);
          setProfile(getFallbackProfile(user));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Auth listener error", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => {
    const role = profile?.role ?? (profile?.email?.includes("admin") ? "admin" : "user");
    return {
      user: firebaseUser,
      profile,
      role,
      loading,
      error,
      isFirebaseEnabled,
      async signup({ email, password, name, wardNumber, photoURL }) {
        if (!auth) {
          throw new Error("Firebase Auth is not configured yet.");
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(credential.user, { displayName: name, photoURL: photoURL || null });
        }
        if (db && isFirebaseEnabled) {
          const userDoc = doc(db, "users", credential.user.uid);
          // Set role to "admin" if email contains "admin", otherwise "user"
          const userRole = email?.toLowerCase().includes("admin") ? "admin" : "user";
          await setDoc(userDoc, {
            uid: credential.user.uid,
            name,
            wardNumber: wardNumber ?? null,
            photoURL: photoURL || null,
            email,
            role: userRole,
            isApproved: userRole === 'admin', // Auto-approve if admin role
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        return credential;
      },
      async login(email, password) {
        if (!auth) {
          throw new Error("Firebase Auth is not configured yet.");
        }
        return signInWithEmailAndPassword(auth, email, password);
      },
      async loginWithGoogle() {
        if (!auth) {
          throw new Error("Firebase Auth is not configured yet.");
        }
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      },
      async logout() {
        if (!auth) return;
        await signOut(auth);
      },
      async resetPassword(email) {
        if (!auth) {
          throw new Error("Firebase Auth is not configured yet.");
        }
        return sendPasswordResetEmail(auth, email);
      },
      async updateUserProfile(data) {
        if (!auth || !auth.currentUser) throw new Error("No user logged in");
        
        // Update Firestore
        if (db && isFirebaseEnabled) {
          const userDoc = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userDoc, {
            ...data,
            updatedAt: serverTimestamp(),
          });
          
          // Update local state
          setProfile(prev => ({ ...prev, ...data }));
        }
        
        // Update Firebase Auth Profile if name/photo changed
        if (data.name || data.photoURL) {
          await updateProfile(auth.currentUser, {
            displayName: data.name,
            photoURL: data.photoURL
          });
        }
      }
    };
  }, [firebaseUser, profile, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

