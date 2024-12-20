import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";

export default function IndexEmployee() {
    const [user, loading] = useAuth();

    return (
        <Root requireAuth>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <GoldButton title="Creditar Coins" onPress={() => router.navigate(Paths.SOON)} style={[styles.button]}/>
                    <GoldButton title="Resgatar Recompensa(s)" onPress={() => router.navigate(Paths.SOON)} style={[styles.button]}/>
                </View>
            </MainView>
        </Root>
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