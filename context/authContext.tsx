import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import db from "@/firebase/config"
import { asyncChangeUserEmailRaw, asyncGetUser } from "@/firebase/user/user";
import { CHCUser } from "@/firebase/user/user";

interface Props extends PropsWithChildren {}

const AuthContext = createContext<[CHCUser | null, boolean]>([null, true]);

export const AuthProvider = ({ children }: Props) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<CHCUser | null>(null);

    useEffect(() => {
        const unsubscribe = db.onAuthStateChanged(db.auth, (currentUser) => {
            if (currentUser == null) {
                setUser(null);
                setLoading(false);
                return;
            }
            
            asyncGetUser(currentUser.uid, { ignoreDeleted: false })
                .then(loggedUser => {
                    if (loggedUser?.deleted && currentUser.emailVerified) {
                        setUser(null);
                        setLoading(false);
                        return;
                    }
                    
                    if (loggedUser?.email != currentUser.email && currentUser.email != null) {
                        asyncChangeUserEmailRaw(currentUser.email)
                    }

                    setUser({ ...loggedUser, firestoreUser: currentUser } as CHCUser);
                    setLoading(false);
                })
                .catch(error => console.error('Error getting user', error));

        });

        
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={[user, loading]}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
