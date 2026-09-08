import { usePets } from "@/hooks/usePets";
import PetCard from "@/components/PetCard";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * A API só permite `POST`/`PUT`/`DELETE` em `/api/pets` para o perfil
 * VETERINARIO (ver `SecurityConfig` do `pethub-java`) — o tutor só lê.
 * Cadastro/edição/exclusão pertencem a um futuro app do veterinário, fora do
 * escopo deste projeto.
 */
export default function PetsScreen() {
  const { data: pets = [], isLoading, isError } = usePets();

  return (
    <SafeAreaView className="flex-1 bg-surface">

      {/* Header */}
      <View className="px-6 pt-4 mb-6">
        <Text className="text-on-surface-variant font-semibold tracking-wide uppercase text-xs font-headline">
          Meus Pets
        </Text>
        <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
          Pets
        </Text>
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
            <View className="items-center justify-center gap-4 mt-20 px-6">
              <Text className="text-6xl">🐾</Text>
              <Text className="text-on-surface font-bold font-headline text-xl">
                Nenhum pet cadastrado
              </Text>
              <Text className="text-on-surface-variant text-center font-body">
                Seus pets aparecem aqui assim que a clínica os cadastrar.
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
            />
          )}
        />
      )}

    </SafeAreaView>
  );
}
