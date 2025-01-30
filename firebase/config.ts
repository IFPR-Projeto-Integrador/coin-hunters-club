import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, setDoc, updateDoc, documentId, where, query, doc, getDoc, Timestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateEmail, updatePassword, sendEmailVerification,
    reauthenticateWithCredential, EmailAuthProvider, deleteUser, sendPasswordResetEmail
 } from "firebase/auth";
import { firebaseConfig } from "@/config";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";


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