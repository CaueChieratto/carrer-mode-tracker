import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyC_2IdJOSEgz1P0rsQFBib-OBvM4BIlzAY",
  authDomain: "career-mode-tracker-30015.firebaseapp.com",
  projectId: "career-mode-tracker-30015",
  storageBucket: "career-mode-tracker-30015.appspot.com",
  messagingSenderId: "429965995253",
  appId: "1:429965995253:web:9c17667534c3fd1676a9bc",
  measurementId: "G-JW7CMWTPBC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
