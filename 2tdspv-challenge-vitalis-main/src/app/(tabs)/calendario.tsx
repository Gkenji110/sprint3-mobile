import { useLembretes } from "@/hooks/useLembretes";
import { useExcluirLembreteMutation } from "@/hooks/useExcluirLembreteMutation";
import { LembreteApiResponse } from "@/services/lembrete.service";
import LembreteCard from "@/components/LembreteCard";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarioScreen() {
  const { data: lembretes = [], isLoading, isError } = useLembretes();
  const { mutate: excluirLembrete, isError: erroAoExcluir, error: erroDeExclusao } = useExcluirLembreteMutation();

  const handleExcluir = (lembrete: LembreteApiResponse) => {
    Alert.alert(
      "Excluir Lembrete",
      `Deseja excluir o lembrete "${lembrete.mensagem}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirLembrete(lembrete.id),
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
            Agenda de Saúde
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            Calendário
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.navigate("/add-lembrete")}
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
            Não foi possível carregar seus lembretes
          </Text>
          <Text className="text-on-surface-variant text-center font-body">
            Verifique se o backend está no ar e tente novamente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lembretes}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View className="items-center justify-center gap-4 mt-20">
              <Text className="text-6xl">📅</Text>
              <Text className="text-on-surface font-bold font-headline text-xl">
                Nenhum lembrete
              </Text>
              <Text className="text-on-surface-variant text-center font-body">
                Toque no + para adicionar um lembrete!
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <LembreteCard
              lembrete={item}
              onPress={() =>
                router.navigate({
                  pathname: "/edit-lembrete",
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
