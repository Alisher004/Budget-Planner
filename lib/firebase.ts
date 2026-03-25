import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const isConfigValid = () => {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  
  for (const key of requiredKeys) {
    const value = firebaseConfig[key as keyof typeof firebaseConfig];
    if (!value || value.includes('your_') || value.includes('your-project-id')) {
      console.error(`❌ Firebase config error: ${key} is not configured properly`);
      console.error('Please update your .env.local file with real Firebase credentials');
      console.error('See FIREBASE_SETUP_INSTRUCTIONS.md for help');
      return false;
    }
  }
  return true;
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
let auth;

if (isConfigValid()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} else {
  // Create a dummy auth object to prevent crashes
  console.warn('⚠️ Firebase not initialized - using placeholder');
}

export { auth };
