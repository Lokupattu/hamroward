import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const COLLECTION_DONATIONS = 'donations';

const MOCK_DONORS = [
  {
    id: 'mock1',
    name: 'Arjun Adhikari',
    fromWard: '5',
    toWard: '1',
    amount: '500',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'mock2',
    name: 'Sunita Thapa',
    fromWard: '2',
    toWard: '3',
    amount: '1000',
    timestamp: new Date(Date.now() - 172800000).toISOString()
  }
];

const sortDonations = (docs) => {
  return [...docs].sort((a, b) => {
    const getT = (item) => {
      if (item.createdAt?.toMillis) return item.createdAt.toMillis();
      if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
      if (item.timestamp) return new Date(item.timestamp).getTime();
      return 0;
    };
    const tA = getT(a);
    const tB = getT(b);
    return tB - tA;
  });
};

export const saveDonation = async (donationData) => {
  if (!db) return { id: 'mock-' + Date.now(), ...donationData };
  try {
    const docRef = await addDoc(collection(db, COLLECTION_DONATIONS), {
      ...donationData,
      createdAt: serverTimestamp(),
      status: 'completed'
    });
    return { id: docRef.id, ...donationData };
  } catch (error) {
    console.error("[DonationSync] Save failed:", error.code, error.message);
    throw error;
  }
};

/**
 * Silent failover subscription.
 * If onSnapshot is blocked (common for guests), it instantly retries with getDocs.
 */
export const subscribeToDonations = (callback) => {
  if (!db) {
    callback(sortDonations(MOCK_DONORS), null);
    return () => {};
  }

  let unsubSnapshot = null;
  let isFailoverTriggered = false;

  const handleUpdate = (docs, err = null) => {
    callback(sortDonations([...docs, ...MOCK_DONORS]), err);
  };

  const attemptGetDocs = async (originalErr) => {
    if (isFailoverTriggered) return;
    isFailoverTriggered = true;
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_DONATIONS));
      const liveDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      handleUpdate(liveDocs, null); // Clear the error if failover worked
    } catch (innerErr) {
      console.error("[DonationSync] Total failure:", innerErr.message);
      handleUpdate([], originalErr.message || innerErr.message);
    }
  };

  try {
    unsubSnapshot = onSnapshot(collection(db, COLLECTION_DONATIONS), (snapshot) => {
      const liveDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      handleUpdate(liveDocs, null);
    }, (err) => {
      // Permission errors on onSnapshot are common if rules are complex.
      // We failover silently to regular fetch which often works when onSnapshot doesn't.
      attemptGetDocs(err);
    });
  } catch (err) {
    attemptGetDocs(err);
  }

  return () => { if (unsubSnapshot) unsubSnapshot(); };
};

// --- ESEWA CONFIG (Restored for Build) ---
const ESEWA_CONFIG = {
  merchant_code: 'EPAYTEST',
  secret_key: '8gBm/:&EnhH.1/q',
  process_url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
};

const generateSignature = async (message) => {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(ESEWA_CONFIG.secret_key);
    const messageData = encoder.encode(message);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = new Uint8Array(signatureBuffer);
    let hashString = '';
    for (let i = 0; i < hashArray.length; i++) {
        hashString += String.fromCharCode(hashArray[i]);
    }
    return btoa(hashString);
  } catch (err) { return ""; }
};

export const prepareEsewaPayment = async (donationData) => {
  const amountStr = Number(donationData.amount).toString();
  const { transaction_uuid } = donationData;
  const product_code = ESEWA_CONFIG.merchant_code;
  const message = `total_amount=${amountStr},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = await generateSignature(message);
  return {
    url: ESEWA_CONFIG.process_url,
    formData: {
      amount: amountStr,
      tax_amount: "0",
      total_amount: amountStr,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${window.location.origin}/donate?status=success`,
      failure_url: `${window.location.origin}/donate?status=failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    }
  };
};

export const getAllDonations = async () => {
    if (!db) return sortDonations(MOCK_DONORS);
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_DONATIONS));
      return sortDonations([...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), ...MOCK_DONORS]);
    } catch (err) { return sortDonations(MOCK_DONORS); }
};

export const getUserDonations = async (userId) => {
    if (!db || !userId) return [];
    try {
      const q = query(collection(db, COLLECTION_DONATIONS), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      return sortDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching user donations:", err);
      return [];
    }
};
