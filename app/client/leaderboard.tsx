import { MainView } from '@/components/layout/MainView';
import Root from '@/components/Root';
import { Colors } from '@/constants/Colors';
import { asyncGetClientsTotalMoneyGains } from '@/firebase/client/repository';
import { ClientWallet } from '@/firebase/client/types';
import { asyncGetPromotionName } from '@/firebase/promotion/repository';
import { CHCUser } from '@/firebase/user/user';
import headerConfig from '@/helper/headerConfig';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Leaderboard() {

    const [promotionName, setPromotionName] = useState<string | null>(null);
    const [clients, setClients] = useState<{ client: CHCUser, totalMoneyGains: number }[]>();

    headerConfig({ title: promotionName ? `Leaderboard ${promotionName}` : "Leaderboard"});

    const route = useRoute();
    const params = route.params as { uidCompany: string, uidPromotion: string };

    let uidCompany: string = '';
    let uidPromotion: string = '';

    if (params) {
        uidCompany = params.uidCompany;
        uidPromotion = params.uidPromotion
    }

    useEffect(() => {
        asyncGetPromotionName(uidCompany, uidPromotion)
            .then(promotionName => setPromotionName(promotionName))
            .catch(console.error);

        asyncGetClientsTotalMoneyGains(uidCompany, uidPromotion)
            .then(clients => {
                clients.sort((a, b) => b.totalMoneyGains - a.totalMoneyGains);

                setClients(clients)
            })
            .catch(console.error);
    }, [uidCompany, uidPromotion]);

    return (
        <Root requireAuth>
            <MainView>
                { clients?.map(({ client, totalMoneyGains }, index) => (
                    <View key={client.uid} style={styles.leaderboardRow}>
                        <Text>{index + 1}. {client.login}</Text>
                        <Text>{totalMoneyGains} Coins</Text>
                    </View>
                ))}
            </MainView>
        </Root>
    );
}

const styles = StyleSheet.create({
    leaderboardRow: {
        backgroundColor: Colors.panel,
        width: "95%",
        flexDirection: "row",
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: "space-between",
    }
});