import { useLembrete } from "@/context/LembreteContext";
import LembreteCard from "@/components/LembreteCard";
import { LembreteInput } from "@/schemas/lembrete.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarioScreen() {
  const { lembretes, removeLembrete } = useLembrete();

  const handleExcluir = (index: number, lembrete: LembreteInput) => {
    Alert.alert(
      "Excluir Lembrete",
      `Deseja excluir o lembrete "${lembrete.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => removeLembrete(index),
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

      {/* Lista */}
      <FlatList
        data={lembretes}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
        keyExtractor={(_, index) => index.toString()}
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
        renderItem={({ item, index }) => (
          <LembreteCard
            lembrete={item}
            onPress={() =>
              router.navigate({
                pathname: "/edit-lembrete",
                params: {
                  index: index.toString(),
                  lembrete: JSON.stringify(item),
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