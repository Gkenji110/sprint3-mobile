import { usePets } from "@/hooks/usePets";
import { useVacina } from "@/context/VacinaContext";
import VacinaCard from "@/components/VacinaCard";
import { iconeDaEspecie } from "@/utils/petIcon";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PetDetailsScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const { data: pets = [], isLoading } = usePets();
  const { getVacinasPorPet, removeVacina, vacinas } = useVacina();

  const petIndex = parseInt(index);
  const pet = pets[petIndex];
  const vacinasDoPet = getVacinasPorPet(petIndex);

  const handleExcluirVacina = (vacinaIndex: number) => {
    Alert.alert(
      "Excluir Vacina",
      "Deseja excluir esta vacina?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const indexReal = vacinas.findIndex(
              (v, i) => v.petIndex === petIndex && getVacinasPorPet(petIndex).indexOf(v) === vacinaIndex
            );
            removeVacina(indexReal);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#02C39A" />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center gap-4">
        <Text className="text-4xl">🐾</Text>
        <Text className="font-headline text-xl font-bold text-on-surface">
          Nenhum pet encontrado
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary font-body font-semibold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

        {/* Card Principal */}
        <View className="bg-secondary rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="bg-primary-container w-16 h-16 rounded-full items-center justify-center">
              <Text className="text-3xl">{iconeDaEspecie(pet.especie)}</Text>
            </View>
            <View>
              <Text className="text-white text-2xl font-bold font-headline">
                {pet.nome}
              </Text>
              <Text className="text-primary-container font-body">
                {pet.especie}{pet.raca ? ` · ${pet.raca}` : ""}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4 pt-4 border-t border-white/10">
            <View>
              <Text className="text-white/60 text-xs uppercase font-bold tracking-widest">
                Peso
              </Text>
              <Text className="text-white font-semibold">{pet.peso ?? "—"} kg</Text>
            </View>
            <View className="w-px bg-white/10" />
            <View>
              <Text className="text-white/60 text-xs uppercase font-bold tracking-widest">
                Sexo
              </Text>
              <Text className="text-white font-semibold">{pet.genero ?? "—"}</Text>
            </View>
          </View>
        </View>

        {/* Vacinas */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-headline text-lg font-bold uppercase text-on-surface">
            Vacinas
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.navigate({
                pathname: "/add-vacina",
                params: { petIndex: petIndex.toString() },
              })
            }
            className="bg-primary w-10 h-10 rounded-full items-center justify-center"
          >
            <MaterialIcons name="add" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {vacinasDoPet.length === 0 ? (
          <View className="bg-surface-container-low rounded-2xl p-6 items-center gap-3 mb-6">
            <Text className="text-3xl">💉</Text>
            <Text className="text-on-surface font-bold font-headline">
              Nenhuma vacina cadastrada
            </Text>
            <Text className="text-on-surface-variant font-body text-sm text-center">
              Toque no + para cadastrar a primeira vacina!
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-6">
            {vacinasDoPet.map((vacina, index) => (
              <VacinaCard
                key={index}
                vacina={vacina}
                onDelete={() => handleExcluirVacina(index)}
              />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
