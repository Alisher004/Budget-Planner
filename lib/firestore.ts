import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, getDocs, where, serverTimestamp, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on client side
let db: Firestore;

if (typeof window !== 'undefined') {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
}

// User functions
export async function getUserData(userId: string) {
  if (!db) return null;
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

export async function createUser(userId: string, email: string) {
  if (!db) return;
  await setDoc(doc(db, 'users', userId), {
    email,
    isPremium: false,
    trialStart: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function updateUserPremiumStatus(userId: string, isPremium: boolean) {
  if (!db) return;
  await updateDoc(doc(db, 'users', userId), {
    isPremium,
    updatedAt: serverTimestamp(),
  });
}

// Payment request functions
export async function createPaymentRequest(userId: string, userEmail: string) {
  if (!db) return '';
  const paymentRef = doc(collection(db, 'payments'));
  await setDoc(paymentRef, {
    userId,
    userEmail,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return paymentRef.id;
}

export async function getAllPaymentRequests() {
  if (!db) return [];
  const paymentsQuery = query(collection(db, 'payments'));
  const snapshot = await getDocs(paymentsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updatePaymentStatus(paymentId: string, status: 'approved' | 'rejected') {
  if (!db) return;
  await updateDoc(doc(db, 'payments', paymentId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserPaymentRequests(userId: string) {
  if (!db) return [];
  const paymentsQuery = query(
    collection(db, 'payments'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(paymentsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export { db };
