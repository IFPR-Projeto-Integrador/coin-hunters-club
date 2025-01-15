import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { StyleSheet, View, Text } from "react-native";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { useState } from "react";
import { StdStyles } from "@/constants/Styles";

export default function CreatePromotion() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [conversion, setConversion] = useState("");

  return (
    <Root requireAuth>
      <MainView>
        <View style={[StdStyles.secondaryContainer,styles.mainContainer]}>
          <FormInput label="Nome da promoção" setValue={setName} value={name} />
          <FormInput label="Data de início" setValue={setStartDate} value={startDate} date/>
          <FormInput label="Data de término" setValue={setEndDate} value={endDate} date />
          <FormInput label="Conversão" setValue={setConversion} value={conversion} number />
          <Text style={styles.text}>Valor em reais que será convertido em 1.000 Coins</Text>
          <GoldButton
            title="Vincular Recompensas"
            onPress={() => router.navigate(Paths.SOON)}
            style={styles.button}
          />
        </View>
        <GoldButton
            title="Salvar"
            onPress={() => router.navigate(Paths.SOON)}
            style={styles.button}
          />
      </MainView>
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
        width: 200,
        height: 200,
        marginTop: 20,
      },
    mainContainer: {
        padding: 15
    },
    button: {
        marginVertical: 10
    },
    text:{
        marginBottom: 10,
    }
})