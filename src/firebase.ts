// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyiBW_FDnxs1iyldPKcK5PKP8Yd1U_ckQ",
  authDomain: "dentist-425d1.firebaseapp.com",
  projectId: "dentist-425d1",
  storageBucket: "dentist-425d1.firebasestorage.app",
  messagingSenderId: "605068091616",
  appId: "1:605068091616:web:29074a72864ea32649b085",
  measurementId: "G-1WQZGD82C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const auth = getAuth(app);
export const db = getFirestore(app);