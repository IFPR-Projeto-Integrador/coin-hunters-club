import { Collapsible } from "@/components/Collapsible";
import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { GoldButton } from "@/components/ui/GoldButton";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/ui/Loading";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/authContext";
import { asyncGetAllCompaniesForClient, asyncReserveReward } from "@/firebase/client/repository";
import { CompaniesWithPromotions, promotionClientErrorToUser, PromotionsWithRewards } from "@/firebase/client/types";
import { promotionErrorToUser, PromotionReward } from "@/firebase/promotion/types";
import { Reward } from "@/firebase/reward/types";
import { dateToString } from "@/helper/dates";
import headerConfig from "@/helper/headerConfig";
import { useEffect, useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity, Modal } from "react-native"
import Icon from "@expo/vector-icons/FontAwesome";
import { confirmPopup } from "@/helper/popups";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";



export default function IndexClient() {
    headerConfig({ title: "Promoções" })
    const [user, loading] = useAuth();
    const isFocused = useIsFocused();

    const [promotions, setPromotions] = useState<CompaniesWithPromotions[] | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<Record<string, number>>({})
    const [reload, setReload] = useState(0);
    const [loadingReserve, setLoadingReserve] = useState(false);

    useEffect(() => {
        setLoadingReserve(true);
        if (user) {
            asyncGetAllCompaniesForClient().then((promotions) => {
                setPromotions(promotions);
                setLoadingReserve(false);
            }).catch(console.error);
        };
    }, [user, reload, isFocused]);


    if (loading)
        return <Loading />

    if (!user)
        return <Loading />

    function onReload() {
        setReload(reload + 1);
    }

    function updateQuantity(promotionId: string, rewardId: string, delta: number) {
        setSelectedQuantity((prev) => ({
            ...prev,
            [promotionId + rewardId]: Math.min(99, Math.max(0, (prev[promotionId + rewardId] || 0) + delta)),
        }));
    };

    function getQuantity(promotionId: string, rewardId: string) {
        let quantity = selectedQuantity[promotionId + rewardId];
        if (quantity == null) {
            quantity = 0;
            selectedQuantity[promotionId + rewardId] = 0;
        }

        return selectedQuantity[promotionId + rewardId];
    }

    async function openLeaderboard(uidCompany: string, uidPromotion: string) {
        router.navigate(`${Paths.LEADERBOARD}?uidCompany=${uidCompany}&uidPromotion=${uidPromotion}`);
    }

    async function reserveReward(uidCompany: string, uidPromotion: string, uidReward: string, amount: number, isAlreadyReserved: boolean) {
        setLoadingReserve(true);
        try {
            if (isAlreadyReserved) {
                confirmPopup("Erro", "Você já reservou essa recompensa.");
                return;
            }
            const result = await asyncReserveReward(uidCompany, uidPromotion, user?.uid!, uidReward, amount)
    
            if (typeof result == "number") {
                confirmPopup("Erro", promotionClientErrorToUser(result));
            }
            else {
                setReload(reload + 1);
            }
        }
        catch(e) {
            confirmPopup("Erro", "Erro ao reservar recompensa.");
        }
        finally {
            setLoadingReserve(false);
        }
    }


    return (
        <Root requireAuth>
            <MainView>
                { !promotions && <Loading /> }
                { promotions?.length === 0 && <Text>Nenhuma promoção foi encontrada. </Text> }
                { promotions?.map(company => (
                    <Collapsible title={company.company.nome} key={company.company.uid} style={styles.companyContainer} fontSize={25}>
                        { company.promotions?.map(promotion => (
                            <View key={promotion.uid} style={styles.promotionContainer}>
                                <View style={styles.nameAndDate}>
                                    <Text style={styles.promotionTitle}>{promotion.name}</Text>
                                    <Text>{dateToString(promotion.dtStart.toDate())} - {dateToString(promotion.dtEnd.toDate())}</Text>
                                </View>
                                <View style={styles.ownedCoins}>
                                    <Text>{promotion.wallet.coins} Coins Conquistados</Text>
                                </View>
                                <TouchableOpacity style={styles.leaderboard} onPress={() => openLeaderboard(company.company.uid, promotion.uid!)}>
                                    <Text>Leaderboard</Text>
                                </TouchableOpacity>
                                { promotion.rewards.map(reward => (
                                    <View style={styles.mainBody} key={`${promotion.uid}${reward.uidReward}`}>
                                        <View style={styles.rewardImageAndInfo}>
                                            <View style={styles.rewardImageAndNameContainer}>
                                                <Text style={styles.rewardImageName}>{reward.reward.name}</Text>
                                                {reward.reward.imageBase64 && <Image source={{ uri: reward.reward.imageBase64 }} style={styles.rewardImage}/>}
                                            </View>
                                            <View style={styles.rewardInfoContainer}>
                                                <View style={styles.rewardInfoRow}>
                                                    <Text>Preço und.</Text>
                                                    <Text style={styles.rewardInfoText}>{reward.unitPrice} Coins</Text>
                                                </View>
                                                <View style={styles.rewardInfoRow}>
                                                    <Text>Quantidade</Text>
                                                    <View style={styles.rewardReserveInputs}>
                                                        <Text style={styles.rewardInfoQuantityText}>{getQuantity(promotion.uid!, reward.uidReward)}</Text>
                                                        <TouchableOpacity style={styles.rewardInfoQuantityInput} 
                                                                        onPress={() => updateQuantity(promotion.uid!, reward.uidReward, 1)}>
                                                            <Icon name="plus" size={19} style={styles.rewardInfoQuantityIcon}/>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.rewardInfoQuantityInput} 
                                                                        onPress={() => updateQuantity(promotion.uid!, reward.uidReward, -1)}>
                                                            <Icon name="minus" size={19} style={styles.rewardInfoQuantityIcon}/>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={styles.rewardInfoRow}>
                                                    <Text>Preço Total</Text>
                                                    <Text style={styles.rewardInfoText}>{reward.unitPrice * getQuantity(promotion.uid!, reward.uidReward)} Coins</Text>
                                                </View>
                                                <View style={styles.rewardInfoRow}>
                                                    <Text>Estoque</Text>
                                                    <Text style={styles.rewardInfoText}>{reward.stock}</Text>
                                                </View>
                                                <TouchableOpacity style={styles.reserveButton} 
                                                    onPress={() => reserveReward(company.company.uid, 
                                                        promotion.uid!, 
                                                        reward.uidReward, 
                                                        getQuantity(promotion.uid!, reward.uidReward),
                                                        reward.reservation != null)}>
                                                    <Text>Reservar</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        { reward.reservation && (
                                            <View style={styles.reservationInfoRow}>
                                                <Text style={styles.reservationLabel}>Código da Reserva</Text>
                                                <Text style={styles.reservationCode}>{reward.reservation.reservationCode}</Text>
                                            </View>
                                        )}
                                        <Text style={styles.rewardDescription}>
                                            {reward.reward.description}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </Collapsible>   
                )) }
            </MainView>
            { loadingReserve && (
                        <Modal style={styles.loadingModal} transparent animationType='fade'>
                          <Loading transparent/>
                        </Modal>
                      ) }
            { !loading && <IconButton icon="refresh" size={28} onPress={onReload} style={styles.floatingButton} /> }
        </Root>
    )
}

const styles = StyleSheet.create({
    companyContainer: {
        backgroundColor: Colors.primaryLighter,
        padding: 10,
        marginTop: 10,
        marginHorizontal: 0,
        width: "80%",
        borderRadius: 10,
    },
    promotionContainer: {
        backgroundColor: Colors.panel,
        marginBottom: 10,
        padding: 5,
    },
    promotionTitle: {
        wordWrap: "break-word",
        width: "40%",
    },
    nameAndDate: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    ownedCoins: {
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    leaderboard: {
        backgroundColor: Colors.primaryDarker,
        marginTop: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    mainBody: {
        backgroundColor: Colors.background,
        flex: 1,
        marginTop: 5,
        paddingRight: 5,
    },
    rewardImageAndInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rewardImageAndNameContainer: {
        flex: 5,
        alignItems: "center",
    },
    rewardImageName: {
        width: "100%",
        wordWrap: "break-word",
        textAlign: "center",
        marginVertical: 5,
    },
    rewardImage: {
        width: 100,
        height: 100,
    },
    rewardInfoContainer: {
        flex: 8,
    },
    rewardInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        textAlignVertical: "center",
        marginTop: 5,
    },
    rewardInfoText: {
        width: "50%",
        backgroundColor: Colors.primary,
        padding: 1,
        paddingHorizontal: 5,
        textAlign: "center",
    },
    rewardReserveInputs: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "50%",
        gap: 5,
    },
    rewardInfoQuantityText: {
        flex: 2,
        backgroundColor: Colors.primary,
        padding: 1,
        paddingHorizontal: 5,
        textAlign: "center",
    },
    rewardInfoQuantityInput: {
        flex: 1,
        height: "100%",
        backgroundColor: Colors.primary,
        padding: 1,
        paddingHorizontal: 5,
        textAlign: "center",
        textAlignVertical: "center",
    },
    rewardInfoQuantityIcon: {
        textAlign: "center",
        backgroundColor: Colors.primary,
    },
    reserveButton: {
        backgroundColor: Colors.primaryDarker,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    rewardDescription: {
        margin: 10,
        marginLeft: 7,
    },
    reservationInfoRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 5,
    },
    reservationLabel: {
        flex: 5,
        textAlign: "center",
    },
    reservationCode: {
        flex: 8,
        backgroundColor: Colors.primaryLighter,
        width: "100%",
        textAlign: "center",
    },
    floatingButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: Colors.primaryDarker,
        borderRadius: 10,
    },
    loadingModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
});