import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, setDoc, updateDoc, documentId, where, query, doc, getDoc, Timestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateEmail, updatePassword, sendEmailVerification,
    reauthenticateWithCredential, EmailAuthProvider, deleteUser, sendPasswordResetEmail
 } from "firebase/auth";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBdij-6f3E6LnJOPBdaQiQbpwzLURPqAfs",
    authDomain: "coin-hunters-club.firebaseapp.com",
    projectId: "coin-hunters-club",
    storageBucket: "coin-hunters-club.firebasestorage.app",
    messagingSenderId: "987543843897",
    appId: "1:987543843897:web:b3224469ac68ea479709e8",
    measurementId: "G-JNJ1681P3E"
};

const app = initializeApp(firebaseConfig);
const db = {
    store: getFirestore(app),
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    setDoc,
    updateDoc,
    documentId,
    where,
    query,
    auth: getAuth(app),
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification,
    deleteUser,
    Timestamp,
    sendPasswordResetEmail,
}

export default db;