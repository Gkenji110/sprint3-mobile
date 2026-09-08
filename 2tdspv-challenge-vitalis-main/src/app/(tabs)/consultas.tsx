import { useConsultas } from "@/hooks/useConsultas";
import ConsultaCard from "@/components/ConsultaCard";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * A API só permite agendar/editar/cancelar consulta (`/api/consultas`) para o
 * perfil VETERINARIO (ver `SecurityConfig` do `pethub-java`) — o tutor só lê
 * o histórico. Agendamento é feito pela clínica.
 */
export default function ConsultasScreen() {
  const { data: consultas = [], isLoading, isError } = useConsultas();

  return (
    <SafeAreaView className="flex-1 bg-surface">

      {/* Header */}
      <View className="px-6 pt-4 mb-6">
        <Text className="text-on-surface-variant font-semibold tracking-wide uppercase text-xs font-headline">
          Histórico
        </Text>
        <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
          Consultas
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
            Não foi possível carregar suas consultas
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
            <View className="items-center justify-center gap-4 mt-20 px-6">
              <Text className="text-6xl">🩺</Text>
              <Text className="text-on-surface font-bold font-headline text-xl">
                Nenhuma consulta
              </Text>
              <Text className="text-on-surface-variant text-center font-body">
                Suas consultas agendadas pela clínica aparecem aqui.
              </Text>
            </View>
          )}
          renderItem={({ item }) => <ConsultaCard consulta={item} />}
        />
      )}

    </SafeAreaView>
  );
}
