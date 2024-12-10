import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function IndexEmpresa() {
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