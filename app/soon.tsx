import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { GoldButton } from "@/components/ui/GoldButton";
import { Paths } from "@/constants/Paths";
import { useAuth } from "@/context/authContext";
import { logout } from "@/firebase/usuario/usuario";
import { router } from "expo-router";
import { Text, StyleSheet } from "react-native";


export default function SoonTM() {
    const [user, loading] = useAuth();

    if (loading) {
        return null;
    }

    async function goBack() {
        if (!loading && user != null) {
            await logout();
        }

        router.navigate(Paths.LOGIN);
    }

    return (
        <Root accountButton={false}>
            <MainView style={styles.mainContainer}>
                <Text style={styles.soonTM}>Em breve!</Text>
                <GoldButton title="Retornar para tela de login" onPress={goBack} style={styles.button}/>
            </MainView>
        </Root>
        
    )
}

const styles = StyleSheet.create({
    soonTM: {
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center"
    },
    mainContainer: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    button: {
        marginTop: 20,
    }
});