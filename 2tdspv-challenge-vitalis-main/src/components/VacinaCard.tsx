import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { VacinaInput } from "@/schemas/vacina.schema";

interface VacinaCardProps {
  vacina: VacinaInput;
  onDelete: () => void;
}

const VacinaCard = ({ vacina, onDelete }: VacinaCardProps) => {
  return (
    <View className="bg-surface-container-low rounded-2xl p-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="bg-primary-container w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="vaccines" size={18} color="#00382a" />
        </View>
        <View className="flex-1">
          <Text className="text-on-surface font-bold font-headline">
            {vacina.nome}
          </Text>
          <Text className="text-on-surface-variant font-body text-sm">
            Aplicada: {vacina.dataAplicacao}
          </Text>
          {vacina.proximaDose ? (
            <Text className="text-primary font-body text-sm font-semibold">
              Próxima: {vacina.proximaDose}
            </Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <View
          className={`px-2 py-1 rounded-full ${
            vacina.status === "Aplicada"
              ? "bg-primary-container"
              : vacina.status === "Atrasada"
              ? "bg-red-100"
              : "bg-surface-container-highest"
          }`}
        >
          <Text
            className={`text-xs font-bold font-headline uppercase ${
              vacina.status === "Aplicada"
                ? "text-on-primary-container"
                : vacina.status === "Atrasada"
                ? "text-red-700"
                : "text-on-surface-variant"
            }`}
          >
            {vacina.status}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VacinaCard;