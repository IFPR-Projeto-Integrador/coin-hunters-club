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

export default function IndexCompany() {
    const [user, loading] = useAuth();

    headerConfig({ title: user?.nome ?? "Empresa" });

    if (loading) {
        return null;
    }

    async function createNew() {
        const now = new Date();
        const nowPlusFive = new Date(now.getTime() + 5 * 60000);
        const nowPlusTen = new Date(now.getTime() + 10 * 60000);

        const promotion: Promotion = {
            uid: undefined,
            name: "Recompensa",
            dtStart: Timestamp.fromDate(nowPlusFive),
            dtEnd: Timestamp.fromDate(nowPlusTen),
            conversion: 10,
            rewards: []
        } 
        const result = await promotions.asyncCreatePromotion(promotion, user!);

        if (result == null)
            console.log("Erro ao criar promoção");
        else
            console.log("Promoção criada com sucesso: ", result);
    }

    async function editLast() {
        const allPromotions = await promotions.asyncGetPromotions(user!);
        const promotion = allPromotions[allPromotions.length - 1];
        const result = await promotions.asyncEditPromotionName(promotion, user!, "Promoção Editada");

        if (result == null)
            console.log("Erro ao editar promoção");
        else
            console.log("Promoção editada com sucesso: ", result)
    }

    async function deleteLast() {
        const allPromotions = await promotions.asyncGetPromotions(user!);
        const promotion: Promotion = allPromotions[allPromotions.length - 1];
        if (promotion == null) {
            console.log("Nenhuma promoção para deletar");
            return;
        }
        await promotions.asyncDeletePromotion(promotion, user!);

        console.log("Deletado promoção com sucesso!");
    }

    return (
        <MainView>
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                <GoldButton title="Recompensas" onPress={() => router.navigate(Paths.REWARD)} style={[styles.button]}/>
                <GoldButton title="Promoções" onPress={() => router.navigate(Paths.PROMOTION)} style={[styles.button]}/>
                <GoldButton title="Funcionários" onPress={() => router.navigate(Paths.EMPLOYEE)} style={[styles.button]}/>

                { user != null ?
                    <>
                        <GoldButton title="Read all" onPress={async () => console.log(await promotions.asyncGetPromotions(user))} style={[styles.button]}></GoldButton>
                        <GoldButton title="Create new" onPress={createNew} style={[styles.button]}></GoldButton>
                        <GoldButton title="Edit last" onPress={editLast} style={[styles.button]}></GoldButton>
                        <GoldButton title="Delete last" onPress={deleteLast} style={[styles.button]}></GoldButton>
                    </>
                : undefined}
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