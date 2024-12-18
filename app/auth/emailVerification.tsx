import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { StdStyles } from "@/constants/Styles";
import { StyleSheet, Text, View } from "react-native";
import { GoldButton } from "@/components/ui/GoldButton";
import { useState } from "react";
import { asyncLogout, asyncSendConfirmationEmail } from "@/firebase/user/user";
import { useAuth } from "@/context/authContext";
import Loading from "@/components/ui/Loading";
import { router } from "expo-router";
import { Paths } from "@/constants/Paths";


export default function EmailVerification() {
    const [auth, loading] = useAuth();

    if (loading)
        return <Loading />;

    async function onSendEmail() {
        const result = await asyncSendConfirmationEmail();

        if (result) {
            alert("Email enviado com sucesso!");
        } else {
            alert("Erro ao enviar email, tente novamente mais tarde.");
        }
    }

    async function goToLogin() {
        await asyncLogout();
        router.navigate(Paths.LOGIN);
    }

    return (
        <Root accountButton={false}>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    <Text style={styles.verifyEmail}>Verificação de Email</Text>
                    <Text style={styles.descriptionText}>Clique no botão abaixo para enviar um email de confirmação. O email deve ser confirmado antes que possa prosseguir.</Text>
                    <GoldButton title="Enviar Email" onPress={onSendEmail} style={[styles.sendEmailButton, styles.button]}/>
                    <GoldButton title="Voltar a tela de login" onPress={goToLogin} style={[styles.button]}/>
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
        fontWeight: "bold",
    },
    descriptionText: {
        textAlign: "center",
        marginBottom: 20,
    },
    sendEmailButton: {
        marginBottom: 20,
    },
    button: {
        width: "100%",
    }
});