import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import headerConfig from "@/helper/headerConfig";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";

export default function IndexEmpresa() {
    const [user, loading] = useAuth();

    headerConfig({ title: user?.nome ?? "Empresa" });

    if (loading) {
        return null;
    }

    return (
        <MainView>
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                <GoldButton title="Recompensas" onPress={() => router.navigate(Paths.REWARDS)} style={[styles.button]}/>
                <GoldButton title="Promoções" onPress={() => router.navigate(Paths.PROMOTIONS)} style={[styles.button]}/>
                <GoldButton title="Funcionários" onPress={() => router.navigate(Paths.EMPLOYEES)} style={[styles.button]}/>  
            </View>
        </MainView>
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