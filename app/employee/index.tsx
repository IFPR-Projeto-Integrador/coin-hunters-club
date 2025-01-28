import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text, Image } from "react-native";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import Loading from "@/components/ui/Loading";
import headerConfig from "@/helper/headerConfig";
import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { asyncGetRewardByReservationCode, asyncRedeemReward } from "@/firebase/client/repository";
import { PromotionClientError, promotionClientErrorToUser, RewardReservation } from "@/firebase/client/types";
import { Reward } from "@/firebase/reward/types";

export default function IndexEmployee() {
    const [user, loading] = useAuth();
    const [clientLogin, setClientLogin] = useState("");
    const [reservationCode, setReservationCode] = useState("");
    const [reward, setReward] = useState<Reward & { uidPromotion: string } | null>(null);

    headerConfig({ title: user?.nome ?? "Funcionário", show: true });

    if (loading)
        return <Loading />

    if (!user)
        return <Loading />

    async function creditCoins() {

    }

    async function redeemReward() {
        if (!reward) {
            alert("Recompensa não encontrada")
            return
        }

        const result = await asyncRedeemReward(user?.uidEmpresa!, reward.uidPromotion, user?.uid!, reservationCode);

        if (typeof result === "number") {
            alert(promotionClientErrorToUser(result))
        }

        alert("Reserva resgatada com sucesso")
        setReward(null);
        setReservationCode("");
    }

    async function setAndShowReward(value: string) {
        if (value.length >= 11) return;

        setReservationCode(value);

        if (value.length < 10) return;
        
        const reservation = await asyncGetRewardByReservationCode(user?.uidEmpresa!, value);

        if (!reservation) {
            alert("Reserva não encontrada")
            return
        }

        setReward(reservation);
    }

    return (
        <Root requireAuth>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <FormInput setValue={setClientLogin} value={clientLogin} label="Login do Cliente"/>
                    <GoldButton title="Creditar" onPress={creditCoins} style={[styles.button]}/>
                    <FormInput setValue={setAndShowReward} value={reservationCode} label="Código da Reserva"/>
                    <View style={styles.imageContainer}>
                        <Text>{reward?.name}</Text>
                        <Image source={{ uri: reward?.imageBase64 }} style={styles.image}/>
                        <Text>{reward?.description}</Text>
                    </View>
                    <GoldButton title="Resgatar" onPress={redeemReward} style={[styles.button]}/>
                </View>
            </MainView>
        </Root>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15,
    },
    button: {
        marginVertical: 10
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 15,
    },
    image: {
        width: 150,
        height: 150,
    },
})