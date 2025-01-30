import { MainView } from "@/components/layout/MainView";
import { CHCLogo } from "@/components/ui/CHCLogo";
import { FormInput } from "@/components/ui/FormInput";
import { GoldButton } from "@/components/ui/GoldButton";
import { Paths } from "@/constants/Paths";
import { StdStyles } from "@/constants/Styles";
import { asyncRequestPasswordReset } from "@/firebase/user/user";
import { confirmPopup } from "@/helper/popups";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";


export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    async function recoverPassword() {
        const result = await asyncRequestPasswordReset(email);

        if (!result) {
            await confirmPopup("Erro", "Não foi possível enviar o email de recuperação de senha. Verifique se o email está correto e tente novamente.");
            return;
        }

        await confirmPopup("Sucesso", "Email de recuperação de senha enviado com sucesso. Confirme seu email");

        router.replace(Paths.LOGIN);
    }

    function goBack() {
        router.replace(Paths.LOGIN);
    }

    return (
        <MainView>
            <CHCLogo />
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                <FormInput value={email} setValue={setEmail} label="Email" placeholder="Digite seu email"/>

                <GoldButton title="Recuperar senha" 
                    onPress={recoverPassword} 
                    style={[styles.space]} 
                    showLoading/>

                <GoldButton title="Voltar" onPress={goBack} />
            </View>
        </MainView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15,
    },
    space: {
        marginVertical: 15,
    },
    disabled: {
        backgroundColor: "gray",
    }
});