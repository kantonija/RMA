import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);

export { auth, firestore };