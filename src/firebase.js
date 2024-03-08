import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  child,
  get,
  query,
  equalTo,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxjU8c6wCp4ATjrplRm3n9MOV1ew5T9Ew",
  authDomain: "mi-cancha-2f927.firebaseapp.com",
  projectId: "mi-cancha-2f927",
  storageBucket: "mi-cancha-2f927.appspot.com",
  messagingSenderId: "935607810236",
  appId: "1:935607810236:web:b5d6742b30225f9621f8b9",
  measurementId: "G-G0K4F04TKJ",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const dataBase = getDatabase();

const auth = getAuth(app);

export {
  app,
  db,
  getDoc,
  getDocs,
  collection,
  signInWithEmailAndPassword,
  auth,
  where,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  dataBase,
  ref,
  set,
  onValue,
  push,
  child,
  get,
  orderByChild,
  query,
  equalTo,
};
