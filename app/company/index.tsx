import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import headerConfig from "@/helper/headerConfig";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import React from "react";
import { Promotion } from "@/firebase/promotion/types";
import * as promotions from "@/firebase/promotion/repository";
import { Timestamp } from "firebase/firestore";
import Loading from "@/components/ui/Loading";

export default function IndexCompany() {
    const [user, loading] = useAuth();

    headerConfig({ title: user?.nome ?? "Empresa" });

    if (loading) {
        return <Loading />;
    }

    return (
        <MainView>
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                <GoldButton title="Recompensas" onPress={() => router.navigate(Paths.REWARD)} style={[styles.button]}/>
                <GoldButton title="Promoções" onPress={() => router.navigate(Paths.PROMOTION)} style={[styles.button]}/>
                <GoldButton title="Funcionários" onPress={() => router.navigate(Paths.EMPLOYEE)} style={[styles.button]}/>
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