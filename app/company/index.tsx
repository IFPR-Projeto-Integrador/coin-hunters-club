import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import headerConfig from "@/helper/headerConfig";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import * as rewards from "@/firebase/reward/repository";
import React from "react";
import { Reward } from "@/firebase/reward/types";

export default function IndexCompany() {
    const [user, loading] = useAuth();

    headerConfig({ title: user?.nome ?? "Empresa" });

    if (loading) {
        return null;
    }

    async function createNew() {
        const reward: Reward = {
            nome: "Recompensa",
            imagem: "Imagem",
            descricao: "Descrição",
            uid: undefined
        } 
        const result = await rewards.asyncCreateReward(reward, user!);

        if (result == null)
            console.log("Erro ao criar recompensa");
        else
            console.log("Recompensa criada com sucesso: ", result);
    }

    async function editLast() {
        const allRewards = await rewards.asyncGetRewards(user!);
        const reward = allRewards[allRewards.length - 1];
        reward.nome = "Recompensa editada";
        const result = await rewards.asyncEditReward(reward, user!);

        if (result == null)
            console.log("Erro ao editar recompensa");
        else
            console.log("Recompensa editada com sucesso: ", result)
    }

    async function deleteLast() {
        const allRewards = await rewards.asyncGetRewards(user!);
        const reward: Reward = allRewards[allRewards.length - 1];
        if (reward == null) {
            console.log("Nenhuma recompensa para deletar");
            return;
        }
        await rewards.asyncDeleteReward(reward, user!);

        console.log("Deletado recompensa com sucesso!");
    }

    return (
        <MainView>
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                <GoldButton title="Recompensas" onPress={() => router.navigate(Paths.REWARD)} style={[styles.button]}/>
                <GoldButton title="Promoções" onPress={() => router.navigate(Paths.PROMOTION)} style={[styles.button]}/>
                <GoldButton title="Funcionários" onPress={() => router.navigate(Paths.EMPLOYEE)} style={[styles.button]}/>

                { user != null ?
                    <>
                        <GoldButton title="Read all" onPress={async () => console.log(await rewards.asyncGetRewards(user))} style={[styles.button]}></GoldButton>
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