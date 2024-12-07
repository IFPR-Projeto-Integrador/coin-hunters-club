import { CHCLogo } from "@/components/CHCLogo";
import { GoldButton } from "@/components/layout/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { FormInput } from "@/components/ui/FormInput";
import { StdStyles } from "@/constants/Styles";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { router } from 'expo-router';
import { Colors } from "@/constants/Colors";
import { CHCUser, LoginError, login as loginUser } from "@/Firebase/usuario/usuario";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<string[]>([])

  async function handleLogin() {
    const result = await loginUser(email, senha);

    if (typeof result == "string") {
      switch(result) {
        case LoginError.INVALID_CREDENTIALS:
          setErrors(["Usuário ou senha inválidos"]);
          break;
        case LoginError.INVALID_EMAIL:
          setErrors(["Email inválido"]);
          break;
        case LoginError.USER_NOT_FOUND:
          setErrors(["Usuário não encontrado"]);
          break;
        case LoginError.EMAIL_EXISTS:
          setErrors(["Email já cadastrado"]);
          break;
        case LoginError.INVALID_PASSWORD:
          setErrors(["Senha inválida"]);
          break;
        case LoginError.INVALID_CREDENTIAL:
          setErrors(["Email ou senha incorretos"]);
          break;
        default:
          setErrors(["Erro desconhecido"]);
      }

      return
    }

    router.navigate("/");
  }

  function toForgotPassword() {
    router.navigate("auth/forgotPassword");
  }

  function goToRegister() {
    router.navigate("/auth/register");
  }

  return (
    <MainView>
      <CHCLogo />
      <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
        {errors.map((error, index) => <Text style={styles.errorMessage} key={index}>{error}</Text>)}
        <FormInput label="Email" setValue={setEmail} value={email} />
        <FormInput label="Senha" setValue={setSenha} value={senha} password />

        <GoldButton
          title="Logar"
          onPress={handleLogin}
          style={styles.loginButton}
        />
        
        <Text style={styles.forgotPassword} onPress={toForgotPassword}>
          Esqueceu sua senha?
        </Text>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não possui uma conta?</Text>
          <GoldButton
            title="Registrar-se"
            onPress={goToRegister}
            style={styles.registerButton}
          />
        </View>
      </View>
    </MainView>
  );
}

const fontSize = 16;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 15,
  },
  loginButton: {
    marginTop: 10,
  },
  forgotPassword: {
    marginTop: 10,
    color: Colors.fontColor,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: fontSize,
  },
  registerContainer: {
    marginTop: 20,
  },
  registerText: {
    marginBottom: 5,
    fontSize: fontSize,
    textAlign: "center",
  },
  registerButton: {
    marginTop: 5,
  },
  errorMessage: {
    color: "red",
    fontSize: fontSize,
  },
});

