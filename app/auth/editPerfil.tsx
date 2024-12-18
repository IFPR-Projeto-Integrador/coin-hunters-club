import { MainView } from "@/components/layout/MainView";
import Root from "@/components/Root";
import { FormInput } from "@/components/ui/FormInput";
import { GoldButton } from "@/components/ui/GoldButton";
import { Colors } from "@/constants/Colors";
import { Paths } from "@/constants/Paths";
import { StdStyles } from "@/constants/Styles";
import { useAuth } from "@/context/authContext";
import { AuthError, asyncDeleteUser, asyncEditUserEmailAndPassword, errorToString, asyncLogout, UserType } from "@/firebase/user/user";
import headerConfig from "@/helper/headerConfig";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";


export default function EditPerfil() {
    const [user, loading] = useAuth();

    const [email, setEmail] = useState(user?.email ?? "");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState<string[]>([]);

    headerConfig({ title: user?.nome ?? "Editar Perfil" });

    if (loading) {
        return null;
    }

    function validate() {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const errors: string[] = [];

        if (email.length != 0) {
            if (!emailRegex.test(email)) {
                errors.push("Email inválido");
            }
        }

        if (senha.length != 0) {
            if (senha.length < 6 ) {
                errors.push("Senha deve ter no mínimo 6 caracteres");
            }

            if (!passwordRegex.test(senha)) {
                errors.push("Senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial");
            }
        }

        if (confirmarSenha.length == 0) {
            errors.push("Digite sua senha atual");
        }

        return errors;
    }

    async function onEdit() {
        const errors = validate();

        if (errors.length > 0) {
            setErro(errors);
            return;
        }

        const result = await asyncEditUserEmailAndPassword(user?.uid ?? "", confirmarSenha, email, senha);

        if (typeof result === "string") {
            if (result === AuthError.INVALID_CREDENTIAL || result === AuthError.WRONG_PASSWORD)
                setErro(["Senha atual incorreta"]);
            else 
                setErro([errorToString(result)]);
            return;
        }

        await asyncLogout();
        router.navigate(Paths.PROFILE);
    }

    async function deleteAccount() {
        const errors = validate();

        if (errors.length > 0) {
            setErro(errors);
            return;
        }

        Alert.alert(
            'Confirmação de deleção de conta',
            'Você tem certeza que deseja deletar sua conta? Essa ação é irreversível.',
            [
                {
                    text: 'Cancelar',
                },
                { 
                    text: 'Sim', 
                    onPress: async () => {
                        const result = await asyncDeleteUser(confirmarSenha)

                        if (typeof result === "string") {
                            setErro([errorToString(result)]);
                            return;
                        }

                        router.navigate(Paths.LOGIN);
                    } 
                },
            ],
            { cancelable: false }
          );
    }

    return (
        <Root requireAuth={true} accountButton={false}>
            <MainView>
                <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                    { erro.length != 0 && erro.map((value) => <Text key={value} style={styles.error}>{value}</Text>) }
                    <FormInput label="Email" value={email} setValue={setEmail} inputBackgroundColor={email == user?.email ? undefined : Colors.primaryLighter}/>
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