import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { ConsultaInput } from "@/schemas/consulta.schema";
import { router } from "expo-router";

interface ConsultaCardProps {
  consulta: ConsultaInput;
  index: number;
  onDelete: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  Agendada: "bg-primary-container",
  Concluída: "bg-surface-container-highest",
  Cancelada: "bg-red-100",
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  Agendada: "text-on-primary-container",
  Concluída: "text-on-surface-variant",
  Cancelada: "text-red-700",
};

const ConsultaCard = ({ consulta, index, onDelete }: ConsultaCardProps) => {
  return (
    <View className="bg-surface-container-low rounded-2xl p-5 gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-on-surface font-bold font-headline text-base">
          {consulta.veterinario}
        </Text>
        <View className={`px-3 py-1 rounded-full ${STATUS_COLORS[consulta.status]}`}>
          <Text className={`text-xs font-bold font-headline uppercase ${STATUS_TEXT_COLORS[consulta.status]}`}>
            {consulta.status}
          </Text>
        </View>
      </View>

      <Text className="text-on-surface-variant font-body text-sm">
        {consulta.clinica} · {consulta.pet}
      </Text>

      <View className="flex-row items-center justify-between pt-2 border-t border-outline-variant">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="calendar-today" size={16} color="#404943" />
          <Text className="text-on-surface-variant font-body text-sm">
            {consulta.data} às {consulta.hora}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          {consulta.status === "Agendada" && (
            <TouchableOpacity
              onPress={() =>
                router.navigate({
                  pathname: "/teleconsulta",
                  params: { index: index.toString() },
                })
              }
              className="flex-row items-center gap-2 bg-primary-container px-3 py-2 rounded-xl"
            >
              <MaterialIcons name="videocam" size={18} color="#00382a" />
              <Text className="text-on-primary-container font-headline font-bold text-xs uppercase">
                Iniciar
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onDelete}>
            <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConsultaCard;