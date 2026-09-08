import { usePets } from "@/hooks/usePets";
import { useExcluirPetMutation } from "@/hooks/useExcluirPetMutation";
import { PetApiResponse } from "@/services/pet.service";
import PacienteCard from "@/components/PacienteCard";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PacientesScreen() {
  const { data: pets = [], isLoading, isError } = usePets();
  const { mutate: excluirPet, isError: erroAoExcluir, error: erroDeExclusao } = useExcluirPetMutation();

  const handleExcluir = (pet: PetApiResponse) => {
    Alert.alert(
      "Excluir Pet",
      `Deseja excluir o cadastro de "${pet.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirPet(pet.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 mb-6">
        <View>
          <Text className="text-on-surface-variant font-semibold tracking-wide uppercase text-xs font-headline">
            Todos os pacientes
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            Pacientes
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/add-pet-vet")}
          className="bg-primary w-12 h-12 rounded-full items-center justify-center"
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Erro da mutation de exclusão */}
      {erroAoExcluir && (
        <Text className="text-red-500 text-center font-body px-6 mb-4">
          {erroDeExclusao.message}
        </Text>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#02C39A" />
        </View>
      ) : isError ? (
        <View className="items-center justify-center gap-4 mt-20 px-6">
          <Text className="text-6xl">⚠️</Text>
          <Text className="text-on-surface font-bold font-headline text-xl text-center">
            Não foi possível carregar os pacientes
          </Text>
          <Text className="text-on-surface-variant text-center font-body">
            Verifique se o backend está no ar e tente novamente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View className="items-center justify-center gap-4 mt-20">
              <Text className="text-6xl">🐾</Text>
              <Text className="text-on-surface font-bold font-headline text-xl">
                Nenhum pet cadastrado
              </Text>
              <Text className="text-on-surface-variant text-center font-body">
                Toque no + para cadastrar um pet!
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <PacienteCard
              pet={item}
              onPress={() =>
                router.push({
                  pathname: "/edit-pet-vet",
                  params: { id: item.id.toString() },
                })
              }
              onDelete={() => handleExcluir(item)}
            />
          )}
        />
      )}

    </SafeAreaView>
  );
}
