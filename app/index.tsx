import { Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import { getAllUsers, getLoggedUser, login, logout ,register, UserType } from "@/Firebase/usuario/usuario"
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const email = "alecalmirp@gmail.com";
  const senha = "batata";
  async function getUsers() {
    const usuarios = await getLoggedUser();

    console.log(usuarios);
  }

  async function loginUser() {
    await login(email, senha);
  }

  async function logoutUser() {
    await logout();
  }

  async function registerUser() {
    await register({
      login: "alecalmirp",
      nome: "Yuri Almir Pinto",
      email: email,
      senha: senha,
      dtNascimento: "1996-02-29",
      cpfCnpj: "12345678900",
      tipoUsuario: UserType.CLIENTE,
    });
  }

  async function allUsers() {
    const usuarios = await getAllUsers();

    console.log(usuarios);
  }

  return (
    <GestureHandlerRootView>
      <ParallaxScrollView style={{ backgroundColor: Colors.background}}>
        <ThemedView style={styles.titleContainer}>
          <ThemedView style={styles.buttons}>
            <Pressable onPress={getUsers}>
              <ThemedText>Logged User</ThemedText>
            </Pressable>
            <Pressable onPress={loginUser}>
              <ThemedText>Login</ThemedText>
            </Pressable>
            <Pressable onPress={logoutUser}>
              <ThemedText>Logout</ThemedText>
            </Pressable>
            <Pressable onPress={registerUser}>
              <ThemedText>Register</ThemedText>
            </Pressable>
            <Pressable onPress={allUsers}>
              <ThemedText>All Users</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  }
});
