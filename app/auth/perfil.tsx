import { Collapsible } from "@/components/Collapsible";
import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { GoldButton } from "@/components/ui/GoldButton";
import { Colors } from "@/constants/Colors";
import { Paths } from "@/constants/Paths";
import { StdStyles } from "@/constants/Styles";
import { useAuth } from "@/context/authContext";
import { asyncGetRedeemedRewards } from "@/firebase/client/repository";
import { UserRedeemedReward } from "@/firebase/client/types";
import { UserType } from "@/firebase/user/user";
import { dateToString } from "@/helper/dates";
import headerConfig from "@/helper/headerConfig";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";


export default function Perfil() {
    const [user, loading] = useAuth();  
    const [trophies, setTrophies] = useState<UserRedeemedReward[]>([]);

    headerConfig({ title: user?.nome ?? "Perfil" });

    useEffect(() => {
        if (!user) return;

        if (user.tipoUsuario == UserType.CLIENTE) {
            asyncGetRedeemedRewards(user.uid)
                .then(setTrophies)
                .catch(console.error);
        }
    }, [user]);

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

    console.log(trophies);

    function onClickEditButton() {
        router.navigate(Paths.EDIT_PROFILE);
    }

    return (
        <Root requireAuth={true} accountButton editButton={{ onPress: onClickEditButton }}>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.info}>{user?.nome}</Text>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.info}>{user?.email}</Text>
                    <Text style={styles.label}>{user?.tipoUsuario == UserType.EMPRESA ? "CNPJ" : "CPF"}:</Text>
                    <Text style={styles.info}>{user?.cpfCnpj}</Text>
                </View>
                { user?.tipoUsuario == UserType.CLIENTE && trophies.length != 0 && (
                    <View style={[StdStyles.secondaryContainer, styles.trofeusContainer]}>
                        <Text style={styles.trofeusTitle}>Troféus</Text>
                        <View style={styles.trofeusList}>
                        { trophies.map((trophy, index) => (
                            <Collapsible key={index} title={trophy.namePromotion} fontSize={25} style={styles.promotionContainer}>
                                <View style={styles.headerInfo}>
                                    <Text>{trophy.totalCoinsGained} Coins totais</Text>
                                    <Text>{dateToString(trophy.dtIniPromotion.toDate())} - {dateToString(trophy.dtEndPromotion.toDate())}</Text>
                                </View>
                                { trophy.redeemedRewards.map((redeemedReward, index) => (
                                    <View key={index} style={styles.rewardContainer}>
                                        <Text style={styles.text}>{redeemedReward.rewardName}</Text>
                                        <Image source={{ uri: redeemedReward.rewardImageBase64 }} style={{ width: 100, height: 100 }}/>
                                        <Text style={[styles.text, styles.amount]}>{redeemedReward.amount}x</Text>
                                    </View>
                                ))}
                            </Collapsible>
                        ))}
                        </View>
                    </View>
                )}
            </MainView>
        </Root>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 15,
    },
    info: {
        fontSize: 16,
        marginTop: 5,
    },
    trofeusContainer: {
        backgroundColor: "transparent",
        marginTop: 0,
    },
    trofeusTitle: {
        backgroundColor: Colors.primary,
        height: 60,
        width: "100%",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 28,
    },
    trofeusList: {
        backgroundColor: Colors.primaryLighter,
        padding: 5,
    },
    promotionContainer: {
        backgroundColor: Colors.panel,
        padding: 10,
        marginHorizontal: 0,
        width: "100%",
    },
    headerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    rewardContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        backgroundColor: Colors.background,
    },
    text: {
        fontSize: 20,
    },
    amount: {
        fontWeight: "bold",
    }
});
