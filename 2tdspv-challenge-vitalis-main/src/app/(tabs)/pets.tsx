import { usePet } from "@/context/PetContext";
import PetCard from "@/components/PetCard";
import { PetInput } from "@/schemas/pet.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PetsScreen() {
  const { pets, removePet } = usePet();

  const handleExcluir = (index: number, pet: PetInput) => {
    Alert.alert(
      "Remover Pet",
      `Deseja remover ${pet.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removePet(index),
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
            Meus Pets
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            Pets
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.navigate("/add-pet")}
          className="bg-primary w-12 h-12 rounded-full items-center justify-center"
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={pets}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={() => (
          <View className="items-center justify-center gap-4 mt-20">
            <Text className="text-6xl">🐾</Text>
            <Text className="text-on-surface font-bold font-headline text-xl">
              Nenhum pet cadastrado
            </Text>
            <Text className="text-on-surface-variant text-center font-body">
              Toque no + para cadastrar seu primeiro pet!
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <PetCard
            pet={item}
            onPress={() =>
              router.navigate({
                pathname: "/pet-details",
                params: { index: index.toString() },
              })
            }
            onEdit={() =>
              router.navigate({
                pathname: "/edit-pet",
                params: {
                  index: index.toString(),
                  pet: JSON.stringify(item),
                },
              })
            }
            onDelete={() => handleExcluir(index, item)}
          />
        )}
      />

    </SafeAreaView>
  );
}