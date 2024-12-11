import { CHCLogo } from "@/components/ui/CHCLogo";
import { GoldButton } from "@/components/ui/GoldButton";
import { MainView } from "@/components/layout/MainView";
import { FormInput } from "@/components/ui/FormInput";
import { StdStyles } from "@/constants/Styles";
import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Redirect, router } from 'expo-router';
import { Colors } from "@/constants/Colors";
import { CHCUser, AuthError, login as loginUser, errorToString, UserType } from "@/firebase/usuario/usuario";
import { useAuth } from "@/context/authContext";
import Loading from "@/components/ui/Loading";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null)
  const [user, loading] = useAuth();

  if (loading) {
    return <Loading />
  }  

  if (user) {
    if (user.tipoUsuario == UserType.EMPRESA) {
      return <Redirect href="/empresa" />;
    }
    if (user.tipoUsuario == UserType.CLIENTE) {
      return <Redirect href="/cliente" />;
    }
    if (user.tipoUsuario == UserType.FUNCIONARIO) {
      return <Redirect href="/funcionario" />;
    }
  }

  async function handleLogin() {
    const result = await loginUser(email, senha);

    if (typeof result == "string") {
      setError(errorToString(result));
      return
    }

    

    if (result.tipoUsuario == UserType.EMPRESA)
      router.navigate("/empresa");
    if (result.tipoUsuario == UserType.CLIENTE)
      router.navigate("/cliente");

  }

  function goToForgotPassword() {
    router.navigate("/auth/forgotPassword");
  }

  function goToRegister() {
    router.navigate("/auth/register");
  }

  return (
    <MainView>
      <CHCLogo />
      <View style={[StdStyles.secondaryContainer, styles.mainContainer]}>
        { error != null && <Text style={styles.errorMessage}>{error}</Text> }
        <FormInput label="Email" setValue={setEmail} value={email} />
        <FormInput label="Senha" setValue={setSenha} value={senha} password />

        <GoldButton
          title="Logar"
          onPress={handleLogin}
          style={styles.loginButton}
        />
        
        <Text style={styles.forgotPassword} onPress={goToForgotPassword}>
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

