import { CHCLogo } from "@/components/ui/CHCLogo";
import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { FormInput } from "@/components/ui/FormInput";
import { StdStyles } from "@/constants/Styles";
import { RegisterInformation, CHCUser, UserType, asyncRegister as asyncRegister, errorToString, asyncLogout } from "@/firebase/user/user";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { router } from 'expo-router';
import { Paths } from "@/constants/Paths";
import { useRoute } from "@react-navigation/native";
import headerConfig from "@/helper/headerConfig";
import db from "@/firebase/config";
import { stringToDate } from "@/helper/dates";
export default function Register() {
    const route = useRoute();
    const params = route.params as { uidEmpresa: string | undefined };
    let uidEmpresa: string | undefined;

    if (params)
        uidEmpresa = params.uidEmpresa;

    const [tab, setTab] = useState<"cliente" | "empresa" | "funcionario">(uidEmpresa ? "funcionario" : "cliente");
    const [error, setError] = useState<string[]>([]);

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmsenha, setConfirmsenha] = useState("");
    const [email, setEmail] = useState("");
    const [confirmemail, setConfirmemail] = useState("");
    const [nome, setNome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [dtNascimento, setDtNascimento] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");

    headerConfig({ title: "Cadastro de Funcionario", show: uidEmpresa ? true : false });

    async function cadastrar() {
        const errors = validate();

        if (errors.length > 0) {
            setError(errors);
            return;
        }

        const user: CHCUser & RegisterInformation = {
            uid: "",
            login,
            nome,
            email,
            dtNascimento: tab != "empresa" ? db.Timestamp.fromDate(stringToDate(dtNascimento as `${number}/${number}/${number}`)) : null,
            dtCadastro: db.Timestamp.now(),
            cpfCnpj, 
            // RN 02 - Conta associada a um único tipo de usuário
            tipoUsuario: tab === "cliente" ? UserType.CLIENTE : tab === "funcionario" ? UserType.FUNCIONARIO : UserType.EMPRESA,
            senha,
            senhaAtual: senhaAtual === "" ? undefined : senhaAtual,
            uidEmpresa: uidEmpresa === undefined ? null : uidEmpresa
        };

        const result = await asyncRegister(user);

        if (typeof result == "string") {
            setError([errorToString(result)]);
            return
        }

        if (uidEmpresa) {
            router.back();
        }
        else
            router.replace(Paths.HOME);
    }

    function validate(): string[] {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const errors: string[] = []

        if (login.length == 0) {
            errors.push("Login não pode ser vazio");
        }

        // RN 04 No mínimo 6 caracteres
        if (senha.length < 6) {
            errors.push("Senha deve ter no mínimo 6 caracteres");
        }
        // RN 04 Verifica se tem uma letra maiúscula, uma minúscula, um número e um caractere especial.
        if (!passwordRegex.test(senha)) {
            errors.push("Senha deve conter ao menos um número, uma letra minúscula, uma letra maiúscula e um caractere especial");
        }

        if (senha !== confirmsenha) {
            errors.push("Senhas não coincidem");
        }

        if (!emailRegex.test(email)) {
            errors.push("Email inválido");
        }

        if (email !== confirmemail) {
            errors.push("Emails não coincidem");
        }

        // RN 03 - Nome deve ter no mínimo 3 caracteres
        if (nome.length < 3) {
            errors.push("Nome inválido");
        }

        if (tab != "empresa") {
            if (dtNascimento.length == 0) {
                errors.push("Data de nascimento não pode estar vazia");
            }
        }

        if (tab === "cliente" || tab === "funcionario") {
            if (cpfCnpj.length < 11) {
                errors.push("CPF não possui caractéres o suficiente");
            }
            if (cpfCnpj.length > 11) {
                errors.push("CPF possui caractéres a mais");
            }
            if (/\D/.test(cpfCnpj)) {
                errors.push("CPF deve ser apenas dígitos");
            }
        } else {
            if (cpfCnpj.length !== 14) {
                errors.push("CNPJ não possui caractéres o suficiente");
            }
            if (/\D/.test(cpfCnpj)) {
                errors.push("CNPJ deve ser apenas dígitos");
            }
        }

        return errors;
    }

    return (
        <MainView>
            { tab !== "funcionario" && <CHCLogo />}
            <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
                { tab !== "funcionario" && (
                    <View style={styles.buttonContainer}>
                        <GoldButton title="Cliente" onPress={() => setTab("cliente")} active={tab === "cliente"} style={[styles.tabButton, { marginRight: 10 }]} />
                        <GoldButton title="Empresa" onPress={() => setTab("empresa")} active={tab === "empresa"} style={styles.tabButton} />
                    </View>
                ) }

                { error.length != 0 && error.map((value) => <Text key={value} style={styles.errorMessage}>{value}</Text>) }

                <FormInput label="Login" placeholder="Digite seu login" setValue={setLogin} value={login}  />
                <FormInput label="Senha" placeholder="Digite sua senha" setValue={setSenha} value={senha} password />
                <FormInput label="Confirmar Senha" placeholder="Confirme sua senha" setValue={setConfirmsenha} value={confirmsenha} password />
                <FormInput label="Email" placeholder="Digite seu email" setValue={setEmail} value={email} />
                <FormInput label="Confirmar Email" placeholder="Confirme seu email" setValue={setConfirmemail} value={confirmemail} />
                <FormInput label="Nome" placeholder={tab == "empresa" ? "Digite o nome da empresa" : "Digite o seu nome"} setValue={setNome} value={nome} />
                { tab != "empresa" && (
                    <FormInput label="Data de nascimento" placeholder="DD/MM/YYYY" setValue={setDtNascimento} value={dtNascimento} date/>
                ) }
                <FormInput label={tab === "cliente" || tab === "funcionario" ? "CPF" : "CNPJ"} setValue={setCpfCnpj} value={cpfCnpj} placeholder={tab == "empresa" ? "Digite seu CNPJ" : "Digite seu CPF"}/>
                { uidEmpresa && (
                    <FormInput label="Senha atual da empresa" setValue={setSenhaAtual} value={senhaAtual} placeholder="Senha atual" password/>
                ) }

                <GoldButton title="Cadastrar-se" onPress={cadastrar} style={styles.registerButton} showLoading></GoldButton>
                { !uidEmpresa && (
                    <GoldButton title="Retornar a tela de login" onPress={async () => {
                        await asyncLogout();
                        router.navigate(Paths.LOGIN);
                    }} />
                ) }
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
        marginVertical: 20,
    },
    errorMessage: {
        color: "red",
        fontSize: 16,
    },
    returnToLogin: {
        marginTop: 10,
        color: "blue",
        fontSize: 16,
    }
})