import "server-only";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID ?? process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;









// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBSZd-ebrXQAcWkL3HX7Q8DhOST9T2kPCM",
//   authDomain: "safe-mode-d593d.firebaseapp.com",
//   projectId: "safe-mode-d593d",
//   storageBucket: "safe-mode-d593d.firebasestorage.app",
//   messagingSenderId: "223619746554",
//   appId: "1:223619746554:web:ac3678b87d8476ec951743",
//   measurementId: "G-XRV0FCMFQ1"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);