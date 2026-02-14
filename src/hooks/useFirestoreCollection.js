import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";

function normalizeData(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function useFirestoreCollection(
  collectionName,
  { filters = [], fallbackData = [], enabled = true } = {}
) {
  const [data, setData] = useState(fallbackData);
  const [status, setStatus] = useState(isFirebaseEnabled ? "loading" : "fallback");
  const [error, setError] = useState(null);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    if (!enabled) return;

    if (!db || !isFirebaseEnabled) {
      setStatus("fallback");
      setData(fallbackData);
      return;
    }

    let ref = collection(db, collectionName);
    filters.forEach(({ field, operator = "==", value }) => {
      if (value === undefined || value === null || value === "") return;
      ref = query(ref, where(field, operator, value));
    });

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        setData(normalizeData(snapshot));
        setStatus("live");
      },
      (err) => {
        console.error(`Firestore collection ${collectionName} error`, err);
        setError(err);
        setStatus("error");
        setData(fallbackData);
      }
    );

    return () => unsubscribe();
  }, [collectionName, filtersKey, enabled, fallbackData]);

  return { data, status, error };
}

export function useFirestoreDocument(collectionName, documentId, { fallbackData = null } = {}) {
  const [data, setData] = useState(fallbackData);
  const [status, setStatus] = useState(documentId ? "loading" : "idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    if (!db || !isFirebaseEnabled) {
      setStatus("fallback");
      setData(fallbackData);
      return;
    }

    const ref = doc(db, collectionName, documentId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setData(fallbackData); 
          setStatus("empty");
          return;
        }
        setData({ id: snapshot.id, ...snapshot.data() });
        setStatus("live");
      },
      (err) => {
        console.error(`Firestore document ${collectionName}/${documentId} error`, err);
        setError(err);
        setStatus("error");
        setData(fallbackData);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId, fallbackData]);

  return { data, status, error };
}

