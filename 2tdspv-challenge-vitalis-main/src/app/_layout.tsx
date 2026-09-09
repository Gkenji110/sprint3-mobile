import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import {
  Lexend_400Regular,
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { PetProvider } from "@/context/PetContext";
import { AuthProvider } from "@/context/AuthContext";
import { VacinaProvider } from "@/context/VacinaContext";
import ControleDeAcesso from "@/components/ControleDeAcesso";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

// Criado fora do componente para sobreviver às re-renderizações: um cliente
// novo a cada render descartaria o cache a cada mudança de estado.
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Inter_400Regular,
    Inter_500Medium,
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ControleDeAcesso>
          <PetProvider>
            <VacinaProvider>
              <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(vet)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="pet-details"
                  options={{
                    title: "Detalhes do Pet",
                  }}
                />
                <Stack.Screen
                  name="add-lembrete"
                  options={{
                    title: "Novo Lembrete",
                  }}
                />
                <Stack.Screen
                  name="edit-lembrete"
                  options={{
                    title: "Editar Lembrete",
                  }}
                />
                <Stack.Screen
                  name="add-pet-vet"
                  options={{
                    title: "Novo Pet",
                  }}
                />
                <Stack.Screen
                  name="edit-pet-vet"
                  options={{
                    title: "Editar Pet",
                  }}
                />
                <Stack.Screen
                  name="add-consulta-vet"
                  options={{
                    title: "Nova Consulta",
                  }}
                />
                <Stack.Screen
                  name="edit-consulta-vet"
                  options={{
                    title: "Editar Consulta",
                  }}
                />
                <Stack.Screen
                  name="sintomas"
                  options={{
                    title: "Relatar Sintomas",
                  }}
                />
                <Stack.Screen
                  name="sugestao-ia"
                  options={{
                    title: "Sugestão",
                  }}
                />
                <Stack.Screen
                  name="teleconsulta"
                  options={{
                    title: "Teleconsulta",
                  }}
                />
              </Stack>
              <StatusBar style="dark" />
            </VacinaProvider>
          </PetProvider>
        </ControleDeAcesso>
      </AuthProvider>
    </QueryClientProvider>
  );
}