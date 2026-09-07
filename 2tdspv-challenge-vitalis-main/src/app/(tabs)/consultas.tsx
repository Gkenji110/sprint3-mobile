import { useConsulta } from "@/context/ConsultaContext";
import ConsultaCard from "@/components/ConsultaCard";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsultasScreen() {
  const { consultas, removeConsulta } = useConsulta();

  const handleExcluir = (index: number) => {
    Alert.alert(
      "Excluir Consulta",
      "Deseja excluir esta consulta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => removeConsulta(index),
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
            Histórico
          </Text>
          <Text className="text-4xl font-extrabold tracking-tighter text-on-surface font-headline">
            Consultas
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.navigate("/sintomas")}
          className="bg-primary w-12 h-12 rounded-full items-center justify-center"
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={consultas}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={() => (
          <View className="items-center justify-center gap-4 mt-20">
            <Text className="text-6xl">🩺</Text>
            <Text className="text-on-surface font-bold font-headline text-xl">
              Nenhuma consulta
            </Text>
            <Text className="text-on-surface-variant text-center font-body">
              Toque no + para relatar sintomas e agendar!
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <ConsultaCard
            consulta={item}
            index={index}
            onDelete={() => handleExcluir(index)}
          />
        )}
      />

    </SafeAreaView>
  );
}