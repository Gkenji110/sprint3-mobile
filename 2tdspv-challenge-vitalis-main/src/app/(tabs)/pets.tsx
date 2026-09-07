import { usePets } from "@/hooks/usePets";
import PetCard from "@/components/PetCard";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PetsScreen() {
  const { data: pets = [], isLoading, isError } = usePets();

  /**
   * Editar e excluir pet ainda não foram migrados pra API (isso é a próxima
   * etapa) — em vez de mexer num dado local que não aparece mais na tela,
   * avisa que ainda não está pronto.
   */
  const avisarEmBreve = () => {
    Alert.alert(
      "Em breve",
      "Editar e excluir pets pela API ainda não foi implementado nesta etapa.",
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

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#02C39A" />
        </View>
      ) : isError ? (
        <View className="items-center justify-center gap-4 mt-20 px-6">
          <Text className="text-6xl">⚠️</Text>
          <Text className="text-on-surface font-bold font-headline text-xl text-center">
            Não foi possível carregar seus pets
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
              onEdit={avisarEmBreve}
              onDelete={avisarEmBreve}
            />
          )}
        />
      )}

    </SafeAreaView>
  );
}
