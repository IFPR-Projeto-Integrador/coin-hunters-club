import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { StyleSheet, View, Text, Image } from "react-native";
import { useAuth } from "@/context/authContext";
import Root from "@/components/Root";
import Loading from "@/components/ui/Loading";
import headerConfig from "@/helper/headerConfig";
import { useEffect, useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { asyncCreditCoins, asyncGetRewardByReservationCode, asyncRedeemReward } from "@/firebase/client/repository";
import { promotionClientErrorToUser } from "@/firebase/client/types";
import { Reward } from "@/firebase/reward/types";
import { useCameraPermissions, CameraView, CameraType } from "expo-camera"
import { confirmPopup } from "@/helper/popups";

export default function IndexEmployee() {
    const [user, loading] = useAuth();
    const [clientLogin, setClientLogin] = useState("");
    const [reservationCode, setReservationCode] = useState("");
    const [reward, setReward] = useState<Reward & { uidPromotion: string } | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [permission, requestPermission] = useCameraPermissions();
    const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);

    headerConfig({ title: user?.nome ?? "Funcionário", show: true });

    if (loading)
        return <Loading />

    if (!user)
        return <Loading />

    if (!permission)
        return <Loading />

    async function creditCoins() {
        if (!qrCodeValue) {
            alert("QR code não detectado")
            return
        }

        const result = await confirmPopup("Creditar moedas", `Deseja creditar moedas para o cliente ${clientLogin}?`);

        if (!result) return;

        const value: { value: number } = JSON.parse(qrCodeValue);

        const transactionResult = await asyncCreditCoins(user?.uidEmpresa!, value.value, clientLogin);

        if (typeof transactionResult === "number") {
            setErrors([promotionClientErrorToUser(transactionResult)]);
        }

        alert("Coins creditados com sucesso!");
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

        if (value.length < 10) {
            setReward(null);
            return;
        }
        
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
                { errors.map((error, index) => <Text key={index}>{error}</Text>) }
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <FormInput setValue={setClientLogin} value={clientLogin} label="Login do Cliente" placeholder="Login"/>
                    <View style={styles.cameraContainer}>
                        <CameraView style={styles.camera} facing={"front"}
                            onBarcodeScanned={(value) => setQrCodeValue(value.data)}
                            barcodeScannerSettings={{
                                barcodeTypes: ["qr"],
                            }}>
                        </CameraView>
                    </View>
                    <Text>QR code detectado: {qrCodeValue}</Text>
                    <GoldButton title={permission.granted ? "Creditar" : "Conceder permissão a câmera"} 
                        onPress={permission.granted ? creditCoins : requestPermission} 
                        style={[styles.button]}
                        showLoading/>
                    <FormInput setValue={setAndShowReward} value={reservationCode} label="Código da Reserva" placeholder="Código"/>
                    <View style={styles.imageContainer}>
                        <Text>{reward?.name}</Text>
                        <Image source={{ uri: reward?.imageBase64 }} style={styles.image}/>
                        <Text>{reward?.description}</Text>
                    </View>
                    <GoldButton title="Resgatar" onPress={redeemReward} style={[styles.button]} showLoading/>
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
    camera: {
        flex: 1,
        width: 150,
        height: 150,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})