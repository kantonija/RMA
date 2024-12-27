import { initializeApp } from "firebase/app";
import { getAuth,signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBR2Dfj3WBmVElsCLTwhNx6ySu6-SNYaxY",
  authDomain: "booktrail-fe731.firebaseapp.com",
  projectId: "booktrail-fe731",
  storageBucket: "booktrail-fe731.firebasestorage.app",
  messagingSenderId: "944933710937",
  appId: "1:944933710937:web:e4226121af346354621548",
  measurementId: "G-C290PXNNDE"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };