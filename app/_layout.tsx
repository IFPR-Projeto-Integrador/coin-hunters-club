import Dropdown from '@/components/ui/Dropdown';
import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/context/authContext';
import { header } from '@/helper/headerConfig';
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
        <Stack.Screen name="auth/perfil" options={header({ title: "Perfil" })}/>
        <Stack.Screen name="auth/editPerfil" options={header({ title: "Editar Perfil" })}/>
        <Stack.Screen name="auth/emailVerification" options={header({ title: "Verificação" })}/>
        
        <Stack.Screen name="company/reward/index" options={{ headerShown: false }}/>
        <Stack.Screen name="company/reward/createReward" options={{ headerShown: false }}/>

        <Stack.Screen name="company/promotion/index" options={{ headerShown: false }}/>
        <Stack.Screen name="company/promotion/createPromotion" options={{ headerShown: false }}/>

        <Stack.Screen name="company/employee/index" options={{ headerShown: false }}/>
        <Stack.Screen name="company/employee/createEmployee" options={{ headerShown: false }}/>

        <Stack.Screen name="empresa/index" options={header({ title: "Empresa" })} />

        <Stack.Screen name="cliente/index" options={{ headerShown: false }}/>

        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }}/>
        <Stack.Screen name="soon" options={header({ title: "Em breve" })}/>
      </Stack>
    </AuthProvider>
    
  );
}

