import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { useEffect, useState } from "react";
import { Promotion } from "@/firebase/promotion/types";
import { asyncDeletePromotion, asyncGetPromotions } from "@/firebase/promotion/repository";
import { Colors } from "@/constants/Colors";
import { dateToString } from "@/helper/dates";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/ui/Loading";
import { promotionEnded, promotionRunning } from "@/firebase/promotion/validation";
import { confirmPopup } from "@/helper/popups";

export default function IndexPromotion() {
    const [user, loading] = useAuth();

    const [promotions, setPromotions] = useState([] as Promotion[]);
    const [reloadEffect, setReloadEffect] = useState(false);
    useEffect(() => {
        if (user) {
            asyncGetPromotions(user).then((promotions) => {
                promotions.sort((a, b) => {
                    if (a.dtEnd.toMillis() > Date.now() && a.dtStart.toMillis() <= Date.now())
                        return -1;
                    return 1;
                })

                setPromotions(promotions);
            }).catch(console.error);
        }
    }, [user, reloadEffect])

    if (loading)
        return null;

    function editPromotion(promotion: Promotion) {
        router.navigate(`${Paths.EDIT_PROMOTION}?uid=${promotion.uid}`);
    }

    async function deletePromotion(promotion: Promotion) {
        const result = await confirmPopup("Excluir recompensa", "Deseja realmente excluir a recompensa?");

        if (result && user) {
            await asyncDeletePromotion(promotion, user);
            setReloadEffect(true);
        }
    }

    return (
        <Root requireAuth>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <GoldButton title="Cadastrar Promoção" onPress={() => router.navigate(Paths.CREATE_PROMOTION)} style={[styles.button]}/>
                </View>
                <View style={[StdStyles.secondaryContainer, styles.promotionContainer]}>
                    { !promotions && <Loading />}
                    { promotions && promotions.map(promotion => (
                        <View key={promotion.uid} style={[StdStyles.secondaryContainer, styles.promotionCard, { backgroundColor: promotionRunning(promotion) ? Colors.primaryLighter : Colors.panel }]}>
                            <Text style={styles.text}>{promotion.name}</Text>
                            <Text style={styles.text}>{dateToString(promotion.dtStart.toDate())} - {dateToString(promotion.dtEnd.toDate())}</Text>
                            <Text style={styles.text}>Conversão: {promotion.conversion}R$/1000 Coin</Text>
                            { !promotionEnded(promotion) && (
                                <View style={styles.buttonContainer}>
                                    <IconButton icon="pencil" style={styles.iconButton} onPress={() => editPromotion(promotion)}/>
                                    <IconButton icon="trash" style={styles.iconButton} onPress={() => deletePromotion(promotion)}/>
                                </View>
                            ) }
                        </View>
                    ))}
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
    },
    promotionCard: {
        padding: 10,
        alignContent: "center",
        width: "100%"
    },
    text: {
        textAlign: "center"
    },
    promotionContainer: {
        alignItems: "center",
        backgroundColor: Colors.background,
        marginTop: 0,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10
    },
    iconButton: {
        backgroundColor: Colors.primaryDarker,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    }
})