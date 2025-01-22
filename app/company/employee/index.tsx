import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";

export default function IndexCompanyEmployee() {
    const [user, loading] = useAuth();

    if (loading)
        return null;

    if (!user)
        return null;

    return (
        <Root requireAuth>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <GoldButton title="Cadastrar Funcionário" onPress={() => router.navigate(`${Paths.REGISTER}?uidEmpresa=${user.uid}`)} style={[styles.button]}/>
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