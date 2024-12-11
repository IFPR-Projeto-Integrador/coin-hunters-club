import { useAuth } from "@/context/authContext";
import { UserType, logout } from "@/firebase/usuario/usuario"
import { Redirect, router, usePathname } from "expo-router";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Loading from "./ui/Loading";
import { Picker } from "@react-native-picker/picker";
import Dropdown from "./ui/Dropdown";
import IconButton from "./ui/IconButton";
import { Colors } from "@/constants/Colors";

interface EditButtonConfig {
    onPress: () => void;
}

interface Props extends PropsWithChildren {
    requireAuth?: boolean;
    showAccountButton?: boolean;
    editButton?: [boolean, EditButtonConfig | null];
}

export default function Root({ children, requireAuth = false, showAccountButton = true, editButton = [false, null] }: Props) {
    const [user, loading] = useAuth();

    const [showEditButton, editButtonConfig] = editButton;

    if (loading) {
        return <Loading />;
    }

    if (!user && requireAuth) {
        return <Redirect href="/" />;
    }

    if (requireAuth && user?.firestoreUser?.emailVerified === false) {
        return <Redirect href="/auth/emailVerification" />;
    }

    async function valueChanged(value: string | number) {
        switch (value) {
            case "perfil":
                router.navigate("/auth/perfil");
                return
            case "logout":
                await logout();
                router.navigate("/");
                return;
        }

    }

    return (
        <>
            {children}
            {showAccountButton && <Dropdown 
                                style={styles.pickerLeft} 
                                onSelect={valueChanged} 
                                icon="user"
                                items={[{ label: "Perfil", value: "perfil" }, { label: "Logout", value: "logout" }]}
                                />}
            { showEditButton && <IconButton icon="pencil" style={styles.pickerRight} onPress={editButtonConfig?.onPress}/>}
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