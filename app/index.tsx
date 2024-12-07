import { StyleSheet, Text, View } from 'react-native';
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
      <View style={styles.titleContainer}>
        <View style={styles.buttons}>
          <Pressable onPress={getUsers}>
            <Text>Logged User</Text>
          </Pressable>
          <Pressable onPress={loginUser}>
            <Text>Login</Text>
          </Pressable>
          <Pressable onPress={logoutUser}>
            <Text>Logout</Text>
          </Pressable>
          <Pressable onPress={registerUser}>
            <Text>Register</Text>
          </Pressable>
          <Pressable onPress={allUsers}>
            <Text>All Users</Text>
          </Pressable>
        </View>
      </View>
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
