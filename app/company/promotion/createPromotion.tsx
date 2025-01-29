import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { useEffect, useState } from "react";
import { StdStyles } from "@/constants/Styles";
import { Promotion, promotionErrorToUser, PromotionReward } from "@/firebase/promotion/types";
import { Timestamp } from "firebase/firestore";
import { isDateStringDDMMYYYY, stringToDate } from "@/helper/dates";
import { asyncCreatePromotion } from "@/firebase/promotion/repository";
import { useAuth } from "@/context/authContext";
import { LayoutModal } from "@/components/layout/LayoutModal";
import { Reward } from "@/firebase/reward/types";
import { asyncGetUserRewards } from "@/firebase/reward/repository";
import RewardCard from "@/components/ui/RewardCard";
import { Colors } from "@/constants/Colors";
import { confirmPopup } from "@/helper/popups";
import { validPromotionReward } from "@/firebase/promotion/validation";

export default function CreatePromotion() {
  const [user, loading] = useAuth();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [conversion, setConversion] = useState("");

  const [rewardVinculationErrors, setRewardVinculationErrors] = useState([] as string[]);
  const [mainErrors, setMainErrors] = useState([] as string[]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewards, setRewards] = useState([] as Reward[]);
  const [rewardModal, setRewardModal] = useState(false);
  const [rewardListModal, setRewardListModal] = useState(false);
  const [vinculatedRewards, setVinculatedRewards] = useState([] as (PromotionReward & { reward: Reward })[]);

  const [unitPriceInCoins, setUnitPriceInCoins] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [limitPerPerson, setLimitPerPerson] = useState<string>("");

  useEffect(() => {
    if (user) {
      asyncGetUserRewards(user).then(setRewards).catch(console.error);
    }
  }, [user])

  if (loading)
    return null;

  // Anexa a recompensa a promoção
  async function addNewReward() {
    if (!selectedReward) {
      setRewardVinculationErrors(["Selecione uma recompensa"]);
      return;
    }

    if (vinculatedRewards.find(r => r.uidReward === selectedReward.uid)) {
      setRewardVinculationErrors(["Recompensa já vinculada"]);
      return;
    }

    const reward: PromotionReward & { reward: Reward } = {
      uidReward: selectedReward.uid as string,
      stock: parseInt(stock),
      unitPrice: parseInt(unitPriceInCoins),
      limitPerUser: parseInt(limitPerPerson),
      reward: selectedReward
    }

    const errors = validPromotionReward(reward);

    if (errors.length > 0) {
      setRewardVinculationErrors(errors.map(promotionErrorToUser));
      return;
    }

    setVinculatedRewards([...vinculatedRewards, reward]);
    setRewardModal(false);

    setUnitPriceInCoins("");
    setStock("");
    setLimitPerPerson("");
    setSelectedReward(null);
  }

  // Salva a promoção no Firebase
  async function save() {
    if (!user)
      return;

    const dateError = [] as string[];

    if (!isDateStringDDMMYYYY(startDate))
      dateError.push("Data inicial inválida");

    if (!isDateStringDDMMYYYY(endDate))
      dateError.push("Data final inválida");

    if (dateError.length > 0 ) {
      setMainErrors(dateError);
      return;
    }

    const promotion: Promotion = {
      name,
      dtStart: Timestamp.fromDate(stringToDate(startDate as `${number}/${number}/${number}`)),
      dtEnd: Timestamp.fromDate(stringToDate(endDate as `${number}/${number}/${number}`)),
      conversion: parseFloat(conversion),
      rewards: vinculatedRewards.map(r => ({ uidReward: r.uidReward, stock: r.stock, unitPrice: r.unitPrice, limitPerUser: r.limitPerUser }))
    }

    const result = await asyncCreatePromotion(promotion, user);
    
    if ("length" in result) {
      setMainErrors(result.map(e => promotionErrorToUser(e)));
      return;
    }

    router.back();
  }

  return (
    <Root requireAuth>
      <MainView>
        <View style={[StdStyles.secondaryContainer,styles.mainContainer]}>
          <FormInput label="Nome da promoção" setValue={setName} value={name} />
          <FormInput label="Data de início" setValue={setStartDate} value={startDate} date/>
          <FormInput label="Data de término" setValue={setEndDate} value={endDate} date />
          <FormInput label="Conversão" setValue={setConversion} value={conversion} number />
          <Text style={styles.text}>Valor em reais que será convertido em 1.000 Coins</Text>

          {mainErrors && mainErrors.map((e) => <Text key={e} style={styles.error}>{e}</Text>)}

          <GoldButton
            title="Vincular Recompensas"
            onPress={() => { setRewardModal(true); setRewardVinculationErrors([]); }}
            style={styles.button}
          />
          
        </View>

        <View style={[StdStyles.secondaryContainer, { backgroundColor: Colors.background, marginVertical: 0 }]}>
          {vinculatedRewards.length > 0 && vinculatedRewards.map((reward, index) => (
              <RewardCard 
                reward={reward.reward} 
                key={reward.uidReward} 
                backgroundColor={Colors.panel}
                onPress={async () => {
                  const result = await confirmPopup("Remover recompensa", "Deseja remover a recompensa?");
                  if (result) {
                    setVinculatedRewards(vinculatedRewards.filter((_, i) => i !== index));
                  }
                }}/>
          ))}
        </View>

        <GoldButton
            title="Salvar"
            onPress={save}
            style={styles.button}
          />
        
      </MainView>
      
      { /* Modal para vincular a recompensa com a promoção */ }
      <LayoutModal isVisible={rewardModal} onClose={() => setRewardModal(false)}>
        <MainView style={{ borderRadius: 20 }}>
          <View style={[StdStyles.secondaryContainer,styles.mainContainer]}>
            <GoldButton title="Recompensas" style={styles.button} onPress={() => setRewardListModal(true)}/>
            { selectedReward && (
              <RewardCard 
                reward={selectedReward}
                imageSize={75}
                fontSize={16}
                backgroundColor={Colors.primaryLighter}/>
            )}
            <FormInput label="Preço unitário em coins" setValue={setUnitPriceInCoins} value={unitPriceInCoins} number/>
            <FormInput label="Estoque" setValue={setStock} value={stock} number />
            <FormInput label="Limite por pessoa" setValue={setLimitPerPerson} value={limitPerPerson} number />
          </View>
          <GoldButton
              title="Salvar"
              onPress={() => addNewReward()}
              style={styles.button}
            />
          {rewardVinculationErrors && rewardVinculationErrors.map((e) => <Text key={e} style={styles.error}>{e}</Text>)}
        </MainView>
      </LayoutModal>

      {  /* Modal para listar as recompensas disponíveis */ }
      <LayoutModal isVisible={rewardListModal} onClose={() => setRewardListModal(false)}>
        <View style={[StdStyles.secondaryContainer, styles.rewardListContainer]}>
          <FlatList
            style={{ width: "100%" }}
            data={rewards}
            keyExtractor={(reward) => reward.uid as string}
            renderItem={({ item: reward }) => (
              <RewardCard
                reward={reward}
                imageSize={75}
                fontSize={16}
                backgroundColor={Colors.primaryLighter}
                borderRadius={0}
                onPress={() => {
                  setSelectedReward(reward);
                  setRewardListModal(false);
                }} />
            )}
          />
        </View>
      </LayoutModal>
    </Root>
  );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 50,
      height: 50,
      marginTop: 20,
    },
    mainContainer: {
      padding: 15
    },
    rewardListContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%"
    },
    button: {
      marginVertical: 10
    },
    text:{
      marginBottom: 10,
    },
    error: {
      color: "red",
    },
    textContainer: {
      justifyContent: 'center',
      flex: 1
    },
    itemContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15
    },
    itemText: {
      fontSize: 12,
    },
})