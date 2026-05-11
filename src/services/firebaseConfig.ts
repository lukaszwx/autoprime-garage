import { getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'SUBSTITUA_PELA_API_KEY',
  authDomain: 'SUBSTITUA_PELO_AUTH_DOMAIN',
  projectId: 'SUBSTITUA_PELO_PROJECT_ID',
  storageBucket: 'SUBSTITUA_PELO_STORAGE_BUCKET',
  messagingSenderId: 'SUBSTITUA_PELO_MESSAGING_SENDER_ID',
  appId: 'SUBSTITUA_PELO_APP_ID',
};

function hasPlaceholderValue(value: string) {
  return value.startsWith('SUBSTITUA_PELO_');
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => value.trim().length > 0 && !hasPlaceholderValue(value)
);

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const db: Firestore | null = app ? getFirestore(app) : null;

// Substitua os valores acima pelas credenciais reais do seu projeto Firebase.
export { firebaseConfig };
