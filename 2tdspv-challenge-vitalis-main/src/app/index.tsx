import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnboardScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOnboard() {
      const onboard = await AsyncStorage.getItem("onboard");

      if (onboard === "feito") {
        router.replace("/login");
      }

      setLoading(false);
    }

    loadOnboard();
  }, []);

  async function onboardCompleted() {
    await AsyncStorage.setItem("onboard", "feito");
    router.replace("/login");
  }

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#1E2D40" }}
      >
        <ActivityIndicator size={64} color="#02C39A" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 items-center p-8"
      style={{ backgroundColor: "#1E2D40" }}
    >

      {/* Topo */}
      <View className="flex-1 items-center justify-center gap-6 w-full">

        {/* Ícone */}
        <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
          <Text className="text-5xl">🐾</Text>
        </View>

        {/* Nome do App */}
        <Text className="text-6xl font-black tracking-tighter text-white uppercase font-headline">
          PetHub
        </Text>

        {/* Mensagem de boas-vindas */}
        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-white font-headline">
            Seja bem-vindo! 👋
          </Text>
          <Text className="text-white/60 text-center font-body text-base px-4">
            Acompanhe a saúde do seu pet de forma contínua e preventiva.
          </Text>
        </View>

        {/* Cards de features */}
        <View className="w-full gap-3 mt-4">
          <View className="flex-row items-center gap-3 bg-white/10 p-4 rounded-2xl">
            <Text className="text-2xl">📅</Text>
            <View>
              <Text className="text-white font-bold font-headline text-sm uppercase">
                Lembretes de Saúde
              </Text>
              <Text className="text-white/60 font-body text-xs">
                Vacinas, consultas e medicamentos
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3 bg-white/10 p-4 rounded-2xl">
            <Text className="text-2xl">📹</Text>
            <View>
              <Text className="text-white font-bold font-headline text-sm uppercase">
                Teleconsulta
              </Text>
              <Text className="text-white/60 font-body text-xs">
                Consultas online com veterinários
              </Text>
            </View>
          </View>
        </View>

      </View>

      {/* Botão */}
      <TouchableOpacity
        onPress={onboardCompleted}
        className="bg-primary w-full rounded-full py-4 mb-4"
      >
        <Text className="text-2xl text-center font-bold text-white font-headline">
          Começar
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default OnboardScreen;