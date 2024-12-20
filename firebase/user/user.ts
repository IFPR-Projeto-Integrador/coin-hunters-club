import db from "@/firebase/config"
import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";

export enum UserType {
    EMPRESA = "empresa",
    CLIENTE = "cliente",
    FUNCIONARIO = "funcionario"
}

export interface CHCUser {
    uid: string;
    login: string;
    nome: string;
    email: string;
    dtNascimento: string | null;
    cpfCnpj: string | null;
    tipoUsuario: UserType;
    firestoreUser?: User;
}

export interface RegisterInformation {
    senha: string;
}

export enum AuthError {
    INVALID_EMAIL = "auth/invalid-email", USER_NOT_FOUND = "auth/user-not-found", EMAIL_EXISTS = "auth/email-already-exists",
    INVALID_PASSWORD = "auth/invalid-password", INVALID_CREDENTIAL = "auth/invalid-credential", WEAK_PASSWORD = "auth/weak-password", 
    WRONG_PASSWORD = "auth/wrong-password", UNKNOWN = "unknown"
}

export async function asyncGetLoggedUser(): Promise<CHCUser | null> {
    if (db.auth.currentUser === null) {
        return null;
    }
    
    const usuariosCollection = db.collection(db.store, "usuarios");
    const usuarioQuery = db.query(usuariosCollection, db.where(db.documentId(), "==", db.auth.currentUser?.uid));
    const usuario = await db.getDocs(usuarioQuery);

    return usuario.docs.map((doc) => {
        const data = doc.data();
        return { ...data, uid: doc.id } as CHCUser
    })[0];
}

export async function asyncGetUser(id: string): Promise<CHCUser | null> {
    const usuariosCollection = db.collection(db.store, "usuarios");

    const usuarioQuery = db.query(usuariosCollection, db.where(db.documentId(), "==", id));
    const usuario = await db.getDocs(usuarioQuery);

    return usuario.docs.map((doc) => {
        const data = doc.data();
        return { ...data, uid: doc.id } as CHCUser
    })[0];
}

export async function asyncGetAllUsers() {
    const usuariosCollection = db.collection(db.store, "usuarios");
    // Select only name and email fields
    const usuarios = await db.getDocs(usuariosCollection);

    return usuarios.docs.map((doc) => {
        const data = doc.data();
        return { ...data, uid: doc.id } as CHCUser
    });
}

export async function asyncLogin(login: string, senha: string): Promise<CHCUser | AuthError> {
    try {
        const usuariosCollection = db.collection(db.store, "usuarios");
        const usuarioQuery = db.query(usuariosCollection, db.where("login", "==", login));
        const usuario = await db.getDocs(usuarioQuery);
        
        if (usuario.docs.length === 0) {
            return AuthError.USER_NOT_FOUND;
        }

        const email = usuario.docs[0].data().email;

        await db.signInWithEmailAndPassword(db.auth, email, senha);

        return await asyncGetLoggedUser() as CHCUser;
    } catch (error) {
        if (error instanceof FirebaseError) {
            return codeToError(error.code);
        }
    }

    throw new Error("'login' function should not reach this point");
}

export async function asyncLogout() {
    try {
        await db.signOut(db.auth);
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error logging out user:", error.message);
        }
    }
}

export async function asyncRegister({login, nome, email, senha, dtNascimento, cpfCnpj, tipoUsuario}: CHCUser & RegisterInformation):
    Promise<CHCUser | AuthError> {
    try {
        const userCredential = await db.createUserWithEmailAndPassword(db.auth, email, senha);
        const authUser = userCredential.user;

        if (authUser.email === null) {
            throw new Error("Email was null during 'register'.");
        }

        const dbUser: CHCUser = {
            uid: authUser.uid,
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

export async function asyncDeleteUser(password: string): Promise<AuthError | undefined> {
    try {
        debugger;
        const user = db.auth.currentUser;
    
        if (!user) {
            return;
        }
    
        const userDocRef = db.doc(db.store, "usuarios", user.uid);

        await asyncReAuth(user, password);

        await db.deleteDoc(userDocRef);
        await db.deleteUser(user);

        return;
    } catch (error) {
        if (error instanceof FirebaseError) {
            return codeToError(error.code);
        }
    }

    throw new Error("Could not delete user");
}

export async function asyncEditUserEmailAndPassword(
    userId: string,
    currentPassword: string,
    newEmail?: string,
    newPassword?: string
  ): Promise<CHCUser | AuthError> {
    try {
        const user = db.auth.currentUser;
    
        if (!user || user.uid !== userId) {
            throw new Error("User not authenticated or incorrect user ID.");
        }

        await asyncReAuth(user, currentPassword);
    
        if (user.email != newEmail && newEmail) {
            await db.updateEmail(user, newEmail);
        }
    
        if (newPassword) {
            await db.updatePassword(user, newPassword);
        }
    
        if (newEmail) {
            const userDocRef = db.doc(db.store, "usuarios", userId);
            await db.updateDoc(userDocRef, { email: newEmail });
        }
    
        return await asyncGetUser(userId) as CHCUser;
    } catch (error) {
        if (error instanceof FirebaseError) {
            return codeToError(error.code);
        } else {
            return AuthError.UNKNOWN;
        }
    }

    throw new Error(`Failed to edit user email/password for user ID: ${userId}`);
}

export async function asyncChangeUserEmailRaw(newEmail: string): Promise<boolean> {
    try {
        const user = db.auth.currentUser;
    
        if (!user) {
            return false;
        }
    
        const usuariosCollection = db.collection(db.store, "usuarios");

        const usuarioQuery = db.query(usuariosCollection, db.where(db.documentId(), "==", user.uid));
        const usuario = await db.getDocs(usuarioQuery);

        await db.updateDoc(usuario.docs[0].ref, { email: newEmail });

        return true;
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error changin email raw", error.message);
        }
    }

    throw new Error("Could not send confirmation email");
}

export async function asyncSendConfirmationEmail(): Promise<boolean> {
    try {
        const user = db.auth.currentUser;
    
        if (!user) {
            return false;
        }
    
        await db.sendEmailVerification(user);
        return true;
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error sending confirmation email:", error.message);
        }
    }

    throw new Error("Could not send confirmation email");
}

function codeToError(errorCode: string): AuthError {
    console.log("errorCode", errorCode);

    switch (errorCode) {
        case AuthError.INVALID_EMAIL:
            return AuthError.INVALID_EMAIL;
        case AuthError.USER_NOT_FOUND:
            return AuthError.USER_NOT_FOUND;
        case "auth/operation-not-allowed":
        case AuthError.EMAIL_EXISTS:
            return AuthError.EMAIL_EXISTS;
        case AuthError.INVALID_PASSWORD:
            return AuthError.INVALID_PASSWORD;
        case AuthError.INVALID_CREDENTIAL:
            return AuthError.INVALID_CREDENTIAL;
        case AuthError.WEAK_PASSWORD:
            return AuthError.WEAK_PASSWORD;
        case AuthError.WRONG_PASSWORD:
            return AuthError.WRONG_PASSWORD;
        default:
            return AuthError.UNKNOWN;
    }
}

async function asyncReAuth(user: User, password: string) {
    const credential = db.EmailAuthProvider.credential(user.email!, password);
    await db.reauthenticateWithCredential(user, credential);
}

export function errorToString(error: AuthError): string {
    switch (error) {
        case AuthError.INVALID_EMAIL:
            return "Email inválido";
        case AuthError.USER_NOT_FOUND:
        case AuthError.WRONG_PASSWORD:
        case AuthError.INVALID_CREDENTIAL:
            return "Login ou senha incorretos";
        case AuthError.EMAIL_EXISTS:
            return "Email já cadastrado";
        case AuthError.INVALID_PASSWORD:
            return "Senha inválida";
        case AuthError.WEAK_PASSWORD:
            return "Senha fraca";
        default:
            return "Erro desconhecido";
    }
}