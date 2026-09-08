import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { LembreteApiResponse } from "@/services/lembrete.service";
import { TIPO_LEMBRETE_LABEL } from "@/schemas/lembrete.schema";
import { paraDataBr } from "@/utils/data";

interface LembreteCardProps {
  lembrete: LembreteApiResponse;
  onPress: () => void;
  onDelete: () => void;
}

const TIPO_ICONE: Record<LembreteApiResponse["tipo"], string> = {
  VACINA: "vaccines",
  CONSULTA: "medical-services",
  EXAME: "monitor-heart",
  MEDICAMENTO: "medication",
  HIDRATACAO: "water-drop",
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
            {lembrete.mensagem}
          </Text>
          <Text className="text-on-surface-variant font-body text-sm">
            {lembrete.nomePet} · {TIPO_LEMBRETE_LABEL[lembrete.tipo]}
          </Text>
          <Text className="text-primary font-body text-sm font-semibold mt-1">
            {paraDataBr(lembrete.dataAgendada)}
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
