import { useAuth } from "@/context/authContext";
import { UserType, asyncLogout } from "@/firebase/user/user"
import { Redirect, router, usePathname } from "expo-router";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Loading from "./ui/Loading";
import { Picker } from "@react-native-picker/picker";
import Dropdown from "./ui/Dropdown";
import IconButton from "./ui/IconButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Paths } from "@/constants/Paths";

interface EditButtonConfig {
    onPress: () => void;
}

interface Props extends PropsWithChildren {
    requireAuth?: boolean;
    accountButton?: boolean;
    editButton?: EditButtonConfig | null;
}

export default function Root({ children, requireAuth = false, accountButton = false, editButton = null }: Props) {
    const [user, loading] = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!user && requireAuth) {
        return <Redirect href={Paths.LOGIN} />;
    }

    if (requireAuth && user?.firestoreUser?.emailVerified === false) {
        return <Redirect href={Paths.EMAIL_VERIFICATION} />;
    }

    async function valueChanged(value: string | number) {
        switch (value) {
            case "perfil":
                router.navigate(Paths.PROFILE);
                return
            case "logout":
                await asyncLogout();
                router.navigate(Paths.LOGIN);
                return;
        }

    }

    return (
        <>
            {children}
            {accountButton && <Dropdown 
                                style={styles.pickerLeft} 
                                onSelect={valueChanged} 
                                icon="user"
                                items={[{ label: "Perfil", value: "perfil" }, { label: "Logout", value: "logout" }]}
                                />}
            { editButton != null && <IconButton icon="pencil" style={styles.pickerRight} onPress={editButton?.onPress}/>}
        </>
    );
}

const styles = StyleSheet.create({
    pickerLeft: {
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    pickerRight: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: Colors.primaryDarker,
        borderRadius: 8,
    }
    
});