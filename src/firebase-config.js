// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDaWpJxJKPdZC-S1kgqULusAFK-bLYJvFY",
  authDomain: "baasi-3d6db.firebaseapp.com",
  projectId: "baasi-3d6db",
  storageBucket: "baasi-3d6db.appspot.com",
  messagingSenderId: "653921242262",
  appId: "1:653921242262:web:6c616b0bfe8e2b0c1346b7",
  measurementId: "G-YZ2QDX8N87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();