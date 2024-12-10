import { MainView } from "@/components/layout/MainView";
import ProtectedRoute from "@/components/ProtectedRoute";
import { GoldButton } from "@/components/ui/GoldButton";
import { StdStyles } from "@/constants/Styles";
import { useAuth } from "@/context/authContext";
import { UserType } from "@/firebase/usuario/usuario";
import headerConfig from "@/helper/headerConfig";
import { Text, View, StyleSheet } from "react-native";


export default function Perfil() {
    const [user, loading] = useAuth();

    if (loading) {
        return null;
    }

    headerConfig({ title: user?.nome ?? "Perfil", headerRight: () => null });

    return (
        <ProtectedRoute>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.info}>{user?.nome}</Text>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.info}>{user?.email}</Text>
                    <Text style={styles.label}>{user?.tipoUsuario == UserType.EMPRESA ? "CNPJ" : "CPF"}:</Text>
                    <Text style={styles.info}>{user?.cpfCnpj}</Text>
                </View>
            </MainView>
        </ProtectedRoute>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 15,
    },
    info: {
        fontSize: 16,
        marginTop: 5,
    }
});