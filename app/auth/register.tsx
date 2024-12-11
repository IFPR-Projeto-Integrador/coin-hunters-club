import { CHCLogo } from "@/components/ui/CHCLogo";
import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { FormInput } from "@/components/ui/FormInput";
import { StdStyles } from "@/constants/Styles";
import { RegisterInformation, CHCUser, UserType, register, errorToString } from "@/firebase/usuario/usuario";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { router } from 'expo-router';

export default function Register() {
    const [tab, setTab] = useState<"cliente" | "empresa">("cliente");
    const [error, setError] = useState<string | null>(null);

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmsenha, setConfirmsenha] = useState("");
    const [email, setEmail] = useState("");
    const [confirmemail, setConfirmemail] = useState("");
    const [nome, setNome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");

    function cadastrar() {
        const user: CHCUser & RegisterInformation = {
            uid: "",
            login,
            nome,
            email,
            dtNascimento: null,
            cpfCnpj,
            tipoUsuario: tab === "cliente" ? UserType.CLIENTE : UserType.EMPRESA,
            senha
        };

        const result = register(user);

        if (typeof result == "string") {
            setError(errorToString(result));
            return
        }

        router.navigate("/");
    }

    return (
        <MainView>
            <CHCLogo />
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                <View style={styles.buttonContainer}>
                    <GoldButton title="Cliente" onPress={() => setTab("cliente")} active={tab === "cliente"} style={[styles.tabButton, { marginRight: 10 }]}></GoldButton>
                    <GoldButton title="Empresa" onPress={() => setTab("empresa")} active={tab === "empresa"} style={styles.tabButton}></GoldButton>
                </View>

                { error != null && <Text style={styles.errorMessage}>{error}</Text> }

                <FormInput label="Login" setValue={setLogin} value={login}  />
                <FormInput label="Senha" setValue={setSenha} value={senha} password />
                <FormInput label="Confirmar Senha" setValue={setConfirmsenha} value={confirmsenha} password />
                <FormInput label="Email" setValue={setEmail} value={email} />
                <FormInput label="Confirmar Email" setValue={setConfirmemail} value={confirmemail} />
                <FormInput label="Nome" setValue={setNome} value={nome} />
                <FormInput label={tab === "cliente" ? "CPF" : "CNPJ"} setValue={setCpfCnpj} value={cpfCnpj} />

                <GoldButton title="Cadastrar-se" onPress={cadastrar} style={styles.registerButton}></GoldButton>
            </View>
        </MainView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 15
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tabButton: {
        flex: 1,
    },
    registerButton: {
        marginTop: 20,
    },
    errorMessage: {
        color: "red",
        fontSize: 16,
      },
})