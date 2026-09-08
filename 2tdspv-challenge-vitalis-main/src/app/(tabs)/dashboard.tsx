import { usePets } from "@/hooks/usePets";
import { useResponsavelPerfil } from "@/hooks/useResponsavelPerfil";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { data: pets = [], isLoading } = usePets();
  const current = pets[0];
  const { data: responsavel } = useResponsavelPerfil();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6 pt-4">

        {/* Header */}
        <View className="mb-8">
          <Text className="text-on-surface-variant font-semibold tracking-wide uppercase text-xs mb-1 font-headline">
            Bem-vindo ao PetHub
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            {responsavel ? `Olá, ${responsavel.nome}!` : "Olá! 👋"}
          </Text>
        </View>

        {/* Card do Pet Ativo */}
        {isLoading ? (
          <View className="bg-surface-container-low rounded-3xl p-10 mb-6 items-center">
            <ActivityIndicator size="large" color="#02C39A" />
          </View>
        ) : current ? (
          <View className="bg-secondary rounded-3xl p-6 mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="bg-primary-container px-3 py-1 rounded-full">
                <Text className="text-on-primary-container text-xs font-black uppercase tracking-widest font-headline">
                  Pet Ativo
                </Text>
              </View>
            </View>
            <Text className="text-white text-3xl font-bold font-headline mb-1">
              {current.nome}
            </Text>
            <Text className="text-primary-container text-lg font-body">
              {current.especie}{current.raca ? ` · ${current.raca}` : ""}
            </Text>
            <View className="flex-row gap-4 mt-4 pt-4 border-t border-white/10">
              <View>
                <Text className="text-white/60 text-xs uppercase font-bold tracking-widest">
                  Peso
                </Text>
                <Text className="text-white font-semibold">{current.peso ?? "—"} kg</Text>
              </View>
              <View className="w-px bg-white/10" />
              <View>
                <Text className="text-white/60 text-xs uppercase font-bold tracking-widest">
                  Sexo
                </Text>
                <Text className="text-white font-semibold">{current.genero ?? "—"}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-surface-container-low rounded-3xl p-6 mb-6 items-center gap-3">
            <Text className="text-4xl">🐾</Text>
            <Text className="text-on-surface font-bold font-headline text-lg">
              Nenhum pet cadastrado
            </Text>
            <Text className="text-on-surface-variant text-center font-body">
              Vá até a aba Pets e cadastre seu primeiro pet!
            </Text>
          </View>
        )}

        {/* Atalhos */}
        <Text className="text-on-surface font-bold font-headline text-lg uppercase mb-4">
          Atalhos
        </Text>
        <View className="flex-row gap-4 mb-6">

          {/* Vacinas */}
          <TouchableOpacity
            className="flex-1 bg-surface-container-low rounded-2xl p-4 items-center gap-2"
            onPress={() => {
              if (pets.length === 0) {
                Alert.alert("Atenção", "Cadastre um pet primeiro!");
                return;
              }
              if (pets.length === 1) {
                router.push({
                  pathname: "/pet-details",
                  params: { index: "0" },
                });
                return;
              }
              Alert.alert(
                "Selecionar Pet",
                "Qual pet deseja ver as vacinas?",
                [
                  ...pets.map((pet, index) => ({
                    text: pet.nome,
                    onPress: () =>
                      router.push({
                        pathname: "/pet-details",
                        params: { index: index.toString() },
                      }),
                  })),
                  {
                    text: "Cancelar",
                    style: "cancel" as const,
                  },
                ]
              );
            }}
          >
            <MaterialIcons name="vaccines" size={32} color="#02C39A" />
            <Text className="text-on-surface font-bold text-center font-headline text-xs uppercase">
              Vacinas
            </Text>
          </TouchableOpacity>

          {/* Lembretes */}
          <TouchableOpacity
            className="flex-1 bg-surface-container-low rounded-2xl p-4 items-center gap-2"
            onPress={() => router.push("/(tabs)/calendario")}
          >
            <MaterialIcons name="calendar-today" size={32} color="#02C39A" />
            <Text className="text-on-surface font-bold text-center font-headline text-xs uppercase">
              Lembretes
            </Text>
          </TouchableOpacity>

          {/* Consultas */}
          <TouchableOpacity
            className="flex-1 bg-surface-container-low rounded-2xl p-4 items-center gap-2"
            onPress={() => router.push("/(tabs)/consultas")}
          >
            <MaterialIcons name="medical-services" size={32} color="#02C39A" />
            <Text className="text-on-surface font-bold text-center font-headline text-xs uppercase">
              Consultas
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
