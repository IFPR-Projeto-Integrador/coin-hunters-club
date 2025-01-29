import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StdStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useAuth } from "@/context/authContext";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { Reward } from "@/firebase/reward/types";
import { useEffect, useState } from "react";
import { asyncGetUserRewards, asyncDeleteReward } from "@/firebase/reward/repository";
import Loading from "@/components/ui/Loading";
import { confirmPopup } from "@/helper/popups";
import RewardCard from "@/components/ui/RewardCard";
import { useIsFocused } from "@react-navigation/native";

export default function IndexReward() {
    const [user, loading] = useAuth();
    const isFocused = useIsFocused();

    let [rewards, setRewards] = useState<Reward[]>([]);
    let [loadingRewards, setLoadingRewards] = useState(true);
    let [reloadEffect, setReloadEffect] = useState(false);

    useEffect(() => {
        if (!isFocused) return;
        
        setLoadingRewards(true);
        if (user) {
            asyncGetUserRewards(user)
                .then(rewards => {
                    setRewards(rewards);
                    setLoadingRewards(false);
                })
                .catch(err => console.error(err));
        }
    }, [user, reloadEffect, isFocused]);

    if (loading)
        return null;

    async function deleteRewardModal(reward: Reward) {
        const result = await confirmPopup("Excluir recompensa", "Deseja realmente excluir a recompensa?");

        if (result && user) {
            await asyncDeleteReward(reward, user);
            setReloadEffect(true);
        }
    }

    return (
        <Root requireAuth>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <GoldButton title="Cadastrar Recompensa" onPress={() => router.navigate(Paths.EDIT_OR_CREATE_REWARD)} style={[styles.button]}/>
                </View>
                <View style={[styles.mainContainer]}>
                    {loadingRewards && <View style={styles.loading}><Loading/></View>}
                    {rewards.map(reward => {
                        return (
                            // <Pressable 
                            //     key={reward.uid} 
                            //     style={[StdStyles.secondaryContainer, styles.itemContainer]}
                            //     onPress={() => router.navigate(`${Paths.EDIT_OR_CREATE_REWARD}?rewardId=${reward.uid}`)}
                            //     onLongPress={() => deleteRewardModal(reward)}>
                            //     <Image source={{ uri: reward.imageBase64 }} style={styles.image}/>
                            //     <View style={styles.textContainer}>
                            //         <Text style={styles.itemText}>Nome: {reward.name}</Text>
                            //         <Text style={styles.itemText}>Descrição: {reward.description}</Text>
                            //     </ View>
                            // </Pressable>
                            <RewardCard 
                                key={reward.uid} 
                                reward={reward} 
                                onPress={() => router.navigate(`${Paths.EDIT_OR_CREATE_REWARD}?rewardId=${reward.uid}`)} 
                                onLongPress={() => deleteRewardModal(reward)}/>
                        )
                    })}
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
    image: {
        width: 100,
        height: 100,
        marginRight: 30,
    },
    itemContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1
    },
    itemText: {
        fontSize: 18,
    },
    loading: {
        marginVertical: 15
    }
})