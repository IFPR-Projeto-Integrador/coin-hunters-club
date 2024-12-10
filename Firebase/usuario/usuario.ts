import db from "@/firebase/config"
import { router } from "expo-router";
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

export async function getUser(id: string): Promise<CHCUser | null> {
    const usuariosCollection = db.collection(db.store, "usuarios");

    const usuarioQuery = db.query(usuariosCollection, db.where(db.documentId(), "==", id));
    const usuario = await db.getDocs(usuarioQuery);

    return usuario.docs.map((doc) => doc.data() as CHCUser)[0];
}

export async function getAllUsers() {
    const usuariosCollection = db.collection(db.store, "usuarios");
    // Select only name and email fields
    const usuarios = await db.getDocs(usuariosCollection);

    return usuarios.docs.map((doc) => doc.data() as CHCUser);
}

export enum AuthError {
    INVALID_CREDENTIALS = "auth/invalid", INVALID_EMAIL = "auth/invalid-email", USER_NOT_FOUND = "auth/user-not-found", EMAIL_EXISTS = "auth/email-already-exists",
    INVALID_PASSWORD = "auth/invalid-password", INVALID_CREDENTIAL = "auth/invalid-credential", UNKNOWN = "unknown"
}

export async function login(email: string, senha: string): Promise<CHCUser | AuthError> {
    try {
        await db.signInWithEmailAndPassword(db.auth, email, senha);

        return await getLoggedUser() as CHCUser;
    } catch (error) {
        if (error instanceof FirebaseError) {
            return codeToError(error.code);
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

export async function register({login, nome, email, senha, dtNascimento, cpfCnpj, tipoUsuario}: CHCUser & RegisterInformation):
    Promise<CHCUser | AuthError> {
    try {
        const userCredential = await db.createUserWithEmailAndPassword(db.auth, email, senha);
        const authUser = userCredential.user;

        if (authUser.email === null) {
            throw new Error("Email was null during 'register'.");
        }

        const dbUser: CHCUser = {
            email: authUser.email,
            login: login,
            nome,
            dtNascimento,
            cpfCnpj,
            tipoUsuario
        }

        await db.setDoc(db.doc(db.store, "usuarios", authUser.uid), dbUser);

        return dbUser;
    } catch (error) {
        if (error instanceof FirebaseError) {
            return codeToError(error.code);
        }
    }

    throw new Error("'register' function should not reach this point");
}

function codeToError(errorCode: string): AuthError {
    switch (errorCode) {
        case AuthError.INVALID_CREDENTIALS:
            return AuthError.INVALID_CREDENTIALS;
        case AuthError.INVALID_EMAIL:
            return AuthError.INVALID_EMAIL;
        case AuthError.USER_NOT_FOUND:
            return AuthError.USER_NOT_FOUND;
        case AuthError.EMAIL_EXISTS:
            return AuthError.EMAIL_EXISTS;
        case AuthError.INVALID_PASSWORD:
            return AuthError.INVALID_PASSWORD;
        case AuthError.INVALID_CREDENTIAL:
            return AuthError.INVALID_CREDENTIAL;
        default:
            return AuthError.UNKNOWN;
    }
}

export function errorToString(error: AuthError): string {
    switch (error) {
        case AuthError.INVALID_CREDENTIALS:
            return "Usuário ou senha inválidos";
        case AuthError.INVALID_EMAIL:
            return "Email inválido";
        case AuthError.USER_NOT_FOUND:
            return "Usuário não encontrado";
        case AuthError.EMAIL_EXISTS:
            return "Email já cadastrado";
        case AuthError.INVALID_PASSWORD:
            return "Senha inválida";
        case AuthError.INVALID_CREDENTIAL:
            return "Email ou senha incorretos";
        default:
            return "Erro desconhecido";
    }
}