import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { GoldButton } from "@/components/ui/GoldButton";
import { Colors } from "@/constants/Colors";
import { Paths } from "@/constants/Paths";
import { StdStyles } from "@/constants/Styles";
import { useAuth } from "@/context/authContext";
import { AuthError, deleteUser, editUserEmailAndPassword, errorToString, UserType } from "@/firebase/usuario/usuario";
import headerConfig from "@/helper/headerConfig";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";


export default function EditPerfil() {
    const [user, loading] = useAuth();

    const [email, setEmail] = useState(user?.email ?? "");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState<string | null>(null);

    headerConfig({ title: user?.nome ?? "Editar Perfil" });

    if (loading) {
        return null;
    }

    async function onEdit() {
        const result = await editUserEmailAndPassword(user?.uid ?? "", confirmarSenha, email, senha);

        if (typeof result === "string") {
            if (result === AuthError.INVALID_CREDENTIAL)
                setErro("Senha atual incorreta");
            else 
                setErro(errorToString(result));
            return;
        }

        router.navigate(Paths.PROFILE);
    }

    async function deleteAccount() {
        if (confirmarSenha.length == 0) {
            setErro("Digite sua senha atual");
            return;
        }

        const result = await deleteUser(confirmarSenha)

        if (typeof result === "string") {
            setErro(errorToString(result));
            return;
        }

        router.navigate(Paths.LOGIN);
    }

    return (
        <Root requireAuth={true} accountButton={false}>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    { erro != null && <Text style={styles.error}>{erro}</Text> }
                    <FormInput label="Email" value={email} setValue={setEmail}/>
                    <FormInput label="Senha" value={senha} setValue={setSenha} password inputBackgroundColor={senha.length == 0 ? undefined : Colors.primaryLighter }/>
                    <FormInput label="Senha atual" value={confirmarSenha} setValue={setConfirmarSenha} password/>
                    <GoldButton title="Editar" onPress={onEdit} style={styles.button}/>
                    <GoldButton title="Deletar Conta" onPress={deleteAccount} danger/>
                </View>
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
    error: {
        color: "red",
    },
    button: {
        marginVertical: 20,
    }
    
});