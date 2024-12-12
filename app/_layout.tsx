import Dropdown from '@/components/ui/Dropdown';
import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/context/authContext';
import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

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
        <Stack.Screen name="auth/login" options={{ headerShown: false }}/>
        <Stack.Screen name="auth/perfil" options={{
          headerTitle: "Perfil",
          ...indexHeader
          }}/>
          <Stack.Screen name="auth/editPerfil" options={{
          headerTitle: "Editar Perfil",
          ...indexHeader
          }}/>
        <Stack.Screen name="auth/emailVerification" options={{
          headerTitle: "Verificação",
          ...indexHeader
          }}/>
        
        <Stack.Screen name="empresa/index" options={{ 
          headerTitle: "Empresa",
          ...indexHeader,
          }} />

        <Stack.Screen name="cliente/index" options={{ headerShown: true }}/>

        <Stack.Screen name="index" options={{ 
          headerTitle: "Empresa",
          ...indexHeader,
          }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }}/>
        <Stack.Screen name="soon" options={{ headerShown: false }}/>
      </Stack>
    </AuthProvider>
    
  );
}

const indexHeader = {
  headerTitleAlign: "center" as "center",
  headerTintColor: Colors.fontColor,
  headerStyle: { backgroundColor: Colors.primary },
}
