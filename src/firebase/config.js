import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ ВАЖНО: Замени эти значения на свои из Firebase Console
// Как получить: https://console.firebase.google.com/
// Выбери проект → Settings (⚙️) → Project settings → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_AUTH_DOMAIN",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_STORAGE_BUCKET",
  messagingSenderId: "ТВОЙ_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
