import { useConsultas } from "@/hooks/useConsultas";
import { usePets } from "@/hooks/usePets";
import { useUnidades } from "@/hooks/useUnidades";
import ConsultaVetItem from "@/components/ConsultaVetItem";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Mesma consulta que o tutor vê (`GET /api/consultas` já filtra pelo escopo
 * de quem pede — veterinário vê todas), mas aqui o card navega pra edição:
 * agendar/editar consulta é rota administrativa, exclusiva do veterinário.
 */
export default function ConsultasVetScreen() {
  const { data: consultas = [], isLoading, isError } = useConsultas();
  const { data: pets = [] } = usePets();
  const { data: unidades = [] } = useUnidades();

  return (
    <SafeAreaView className="flex-1 bg-surface">

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 mb-6">
        <View>
          <Text className="text-on-surface-variant font-semibold tracking-wide uppercase text-xs font-headline">
            Todas as consultas
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            Consultas
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/add-consulta-vet")}
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
            Não foi possível carregar as consultas
          </Text>
          <Text className="text-on-surface-variant text-center font-body">
            Verifique se o backend está no ar e tente novamente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={consultas}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View className="items-center justify-center gap-4 mt-20">
              <Text className="text-6xl">🩺</Text>
              <Text className="text-on-surface font-bold font-headline text-xl">
                Nenhuma consulta agendada
              </Text>
              <Text className="text-on-surface-variant text-center font-body">
                Toque no + para agendar uma consulta!
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ConsultaVetItem consulta={item} pets={pets} unidades={unidades} />
          )}
        />
      )}

    </SafeAreaView>
  );
}
