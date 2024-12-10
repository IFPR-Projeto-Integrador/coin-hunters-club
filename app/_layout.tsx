import Dropdown from '@/components/ui/Dropdown';
import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/context/authContext';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Picker } from "@react-native-picker/picker";
import IconButton from '@/components/ui/IconButton';
import { Button } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="auth/forgotPassword" options={{ headerShown: false }}/>
        <Stack.Screen name="auth/register" options={{ headerShown: false }}/>
        <Stack.Screen name="auth/perfil" options={{
          headerTitle: "Perfil",
          ...indexHeader
          }}/>
        
        <Stack.Screen name="empresa/index" options={{ 
          headerTitle: "Empresa",
          ...indexHeader,
          }} />
        <Stack.Screen name="cliente/index" options={{ headerShown: true }}/>

        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="+not-found" options={{ headerShown: false }}/>
      </Stack>
    </AuthProvider>
    
  );
}

const indexHeader = {
  headerTitleAlign: "center" as "center",
  headerTintColor: Colors.fontColor,
  headerStyle: { backgroundColor: Colors.primary },
  headerRight: () => (
    <Button title="teste" onPress={() => console.log("Batata")}/>
    // <Dropdown 
    //   onSelect={async (value) => {
    //     if (value === "perfil") {
    //       router.navigate(`/auth/perfil`);
    //     } else {
    //       await logout();
    //       router.navigate("/");
    //     }
    //   }} 
    //   items={[{label: "Perfil", value: "perfil"}, {label: "Logout", value: "logout"}]} 
    //   icon="bars" 
    //   style={{
    //     marginRight: Platform.OS === "web" ? 20 : 0,
    //     width: 64
    //   }}
    //   />
  )
}
