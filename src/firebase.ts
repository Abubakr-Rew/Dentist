// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD49YItN-AxzSfXPkNHzhS09jRjDaXL3HY",
  authDomain: "dentist-web-app-aa2db.firebaseapp.com",
  projectId: "dentist-web-app-aa2db",
  storageBucket: "dentist-web-app-aa2db.firebasestorage.app",
  messagingSenderId: "464081893044",
  appId: "1:464081893044:web:f6aace2469d0bd0e4b09e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const auth = getAuth(app);
export const db = getFirestore(app);