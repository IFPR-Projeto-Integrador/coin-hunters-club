import db from "@/Firebase/config"
import { FirebaseError } from "firebase/app";

export enum UserType {
    EMPRESA = "empresa",
    CLIENTE = "cliente",
    FUNCIONARIO = "funcionario"
}

export interface CHCUser {
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

export async function getLoggedUser(): Promise<CHCUser | null> {
    if (db.auth.currentUser === null) {
        return null;
    }
    
    const usuariosCollection = db.collection(db.store, "usuarios");
    const usuarioQuery = db.query(usuariosCollection, db.where(db.documentId(), "==", db.auth.currentUser?.uid));
    const usuario = await db.getDocs(usuarioQuery);

    return usuario.docs.map((doc) => doc.data() as CHCUser)[0];
}

export async function getAllUsers() {
    const usuariosCollection = db.collection(db.store, "usuarios");
    // Select only name and email fields
    const usuarios = await db.getDocs(usuariosCollection);

    return usuarios.docs.map((doc) => doc.data() as CHCUser);
}

export enum LoginError {
    INVALID_CREDENTIALS = "auth/invalid", INVALID_EMAIL = "auth/invalid-email", USER_NOT_FOUND = "auth/user-not-found", EMAIL_EXISTS = "auth/email-already-exists",
    INVALID_PASSWORD = "auth/invalid-password", INVALID_CREDENTIAL = "auth/invalid-credential", UNKNOWN = "unknown"
}

export async function login(email: string, senha: string): Promise<CHCUser | LoginError> {
    try {
        await db.signInWithEmailAndPassword(db.auth, email, senha);

        return await getLoggedUser() as CHCUser;
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case LoginError.INVALID_CREDENTIALS:
                    return LoginError.INVALID_CREDENTIALS;
                case LoginError.INVALID_EMAIL:
                    return LoginError.INVALID_EMAIL;
                case LoginError.USER_NOT_FOUND:
                    return LoginError.USER_NOT_FOUND;
                case LoginError.EMAIL_EXISTS:
                    return LoginError.EMAIL_EXISTS;
                case LoginError.INVALID_PASSWORD:
                    return LoginError.INVALID_PASSWORD;
                case LoginError.INVALID_CREDENTIAL:
                    return LoginError.INVALID_CREDENTIAL;
                default:
                    return LoginError.UNKNOWN;
            }
        }
    }

    throw new Error("'login' function should not reach this point");
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

export async function register({login, nome, email, senha, dtNascimento, cpfCnpj, tipoUsuario}: CHCUser & RegisterInformation) {
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