import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import ProtectedRoute from "@/components/ProtectedRoute";
import headerConfig from "@/helper/headerConfig";
import { useAuth } from "@/context/authContext";

export default function IndexEmpresa() {
    const [user, loading] = useAuth();

    if (loading) {
        return null;
    }

    headerConfig({ title: user?.nome ?? "Empresa" });

    return (
        <ProtectedRoute>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <GoldButton title="Recompensas" onPress={() => router.navigate("")} style={[styles.button]}/>
                    <GoldButton title="Promoções" onPress={() => router.navigate("")} style={[styles.button]}/>
                    <GoldButton title="Funcionários" onPress={() => router.navigate("")} style={[styles.button]}/>  
                </View>
            </MainView>
        </ProtectedRoute>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15
    },
    button: {
        marginVertical: 10
    }
})