import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { StdStyles } from "@/constants/Styles";
import { StyleSheet, Text, View } from "react-native";
import { GoldButton } from "@/components/ui/GoldButton";
import { useState } from "react";
import { sendConfirmationEmail } from "@/firebase/usuario/usuario";
import { useAuth } from "@/context/authContext";
import Loading from "@/components/ui/Loading";


export default function EmailVerification() {
    const [auth, loading] = useAuth();

    if (loading)
        return <Loading />;

    async function onSendEmail() {
        const result = await sendConfirmationEmail();

        if (result) {
            alert("Email enviado com sucesso!");
        } else {
            alert("Erro ao enviar email, tente novamente mais tarde.");
        }
    }

    return (
        <Root>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <Text>Verificação de Email</Text>
                    <Text>Clique no botão abaixo para enviar um email de confirmação.</Text>
                    <GoldButton title="Enviar Email" onPress={onSendEmail}/>
                </View>
            </MainView>
        </Root>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    verifyEmail: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
    }
});