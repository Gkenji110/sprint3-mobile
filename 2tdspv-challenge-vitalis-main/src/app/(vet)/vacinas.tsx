import { useVacinasTratamentos } from "@/hooks/useVacinasTratamentos";
import { useExcluirVacinaTratamentoMutation } from "@/hooks/useExcluirVacinaTratamentoMutation";
import { VacinaTratamentoApiResponse } from "@/services/vacinaTratamento.service";
import VacinaTratamentoCard from "@/components/VacinaTratamentoCard";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Mesma vacina/tratamento que o tutor vê no pet dele (`GET
 * /api/vacinas-tratamentos` já filtra pelo escopo de quem pede —
 * veterinário vê todas), mas aqui o card navega pra edição e permite
 * excluir: registrar/editar/excluir é rota clínica, exclusiva do
 * veterinário.
 */
export default function VacinasVetScreen() {
  const { data: itens = [], isLoading, isError } = useVacinasTratamentos();
  const { mutate: excluir, isError: erroAoExcluir, error: erroDeExclusao } = useExcluirVacinaTratamentoMutation();

  const handleExcluir = (item: VacinaTratamentoApiResponse) => {
    Alert.alert(
      "Excluir Registro",
      `Deseja excluir "${item.nome}" de ${item.nomePet}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluir(item.id),
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
            Vacinas e tratamentos
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            Vacinas
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/add-vacina-tratamento-vet")}
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
            Não foi possível carregar os registros
          </Text>
          <Text className="text-on-surface-variant text-center font-body">
            Verifique se o backend está no ar e tente novamente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={itens}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View className="items-center justify-center gap-4 mt-20">
              <Text className="text-6xl">💉</Text>
              <Text className="text-on-surface font-bold font-headline text-xl">
                Nenhum registro
              </Text>
              <Text className="text-on-surface-variant text-center font-body">
                Toque no + para registrar uma vacina ou tratamento!
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <VacinaTratamentoCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/edit-vacina-tratamento-vet",
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
