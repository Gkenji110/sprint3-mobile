import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { LembreteInput } from "@/schemas/lembrete.schema";

interface LembreteCardProps {
  lembrete: LembreteInput;
  onPress: () => void;
  onDelete: () => void;
}

const TIPO_ICONE: Record<string, string> = {
  Vacina: "vaccines",
  Consulta: "medical-services",
  Medicamento: "medication",
  "Check-up": "monitor-heart",
  Outro: "event-note",
};

const LembreteCard = ({ lembrete, onPress, onDelete }: LembreteCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface-container-low rounded-2xl p-5"
    >
      <View className="flex-row items-center gap-4">
        <View className="bg-primary-container w-12 h-12 rounded-full items-center justify-center">
          <MaterialIcons
            name={TIPO_ICONE[lembrete.tipo] as any}
            size={22}
            color="#00382a"
          />
        </View>
        <View className="flex-1">
          <Text className="text-on-surface font-bold font-headline text-base">
            {lembrete.titulo}
          </Text>
          <Text className="text-on-surface-variant font-body text-sm">
            {lembrete.petNome} · {lembrete.tipo}
          </Text>
          <Text className="text-primary font-body text-sm font-semibold mt-1">
            {lembrete.data} às {lembrete.hora}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default LembreteCard;