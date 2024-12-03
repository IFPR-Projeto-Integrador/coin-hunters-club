import db from "@/Firebase/config"
import { FirebaseError } from "firebase/app";

export enum UserType {
    EMPRESA = "empresa",
    CLIENTE = "cliente",
    FUNCIONARIO = "funcionario"
}

export interface User {
    login: string;
    nome: string;
    email: string;
    dtNascimento: string | null;
    cpfCnpj: string | null;
    tipoUsuario: UserType;
}

export interface RegisterInformation {
    senha: string;
}

export async function getLoggedUser() {
    if (db.auth.currentUser === null) {
        return null;
    }
    
    const usuariosCollection = db.collection(db.store, "usuarios");
    const usuarioQuery = db.query(usuariosCollection, db.where(db.documentId(), "==", db.auth.currentUser?.uid));
    const usuario = await db.getDocs(usuarioQuery);

    return usuario.docs.map((doc) => doc.data() as User)[0];
}

export async function getAllUsers() {
    const usuariosCollection = db.collection(db.store, "usuarios");
    // Select only name and email fields
    const usuarios = await db.getDocs(usuariosCollection);

    return usuarios.docs.map((doc) => doc.data() as User);
}

export async function login(email: string, senha: string) {
    try {
        const userCredential = await db.signInWithEmailAndPassword(db.auth, email, senha);
        const user = userCredential.user;
        console.log("User logged in:", user);
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error logging in user:", error.message);
        }
    }   
}

export async function logout() {
    try {
        await db.signOut(db.auth);
        console.log("User logged out");
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error logging out user:", error.message);
        }
    }
}

export async function register({login, nome, email, senha, dtNascimento, cpfCnpj, tipoUsuario}: User & RegisterInformation) {
    try {
        const userCredential = await db.createUserWithEmailAndPassword(db.auth, email, senha);
        const authUser = userCredential.user;

        const dbUser = {
            email: authUser.email,
            login: login,
            nome,
            dtNascimento,
            cpfCnpj,
            tipoUsuario
        }

        await db.setDoc(db.doc(db.store, "usuarios", authUser.uid), dbUser);

        console.log("User registered:", authUser);
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error registering user:", error.message);
        }
    }
}