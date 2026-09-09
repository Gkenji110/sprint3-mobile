import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { ConsultaApiResponse } from "@/services/consulta.service";
import { router } from "expo-router";

interface ConsultaCardProps {
  consulta: ConsultaApiResponse;
  /** Só o veterinário edita consulta — o tutor não passa isso, e o card vira só leitura. */
  onPress?: () => void;
  /** Atalho pro veterinário marcar como realizada sem abrir a edição inteira. */
  onMarcarRealizada?: () => void;
}

const STATUS_COLORS: Record<ConsultaApiResponse["status"], string> = {
  AGENDADA: "bg-primary-container",
  REALIZADA: "bg-surface-container-highest",
  CANCELADA: "bg-red-100",
};

const STATUS_TEXT_COLORS: Record<ConsultaApiResponse["status"], string> = {
  AGENDADA: "text-on-primary-container",
  REALIZADA: "text-on-surface-variant",
  CANCELADA: "text-red-700",
};

const STATUS_LABELS: Record<ConsultaApiResponse["status"], string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
};

function formatarDataHora(dataHoraIso: string): { data: string; hora: string } {
  const data = new Date(dataHoraIso);
  return {
    data: data.toLocaleDateString("pt-BR"),
    hora: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

/** Cadastro, edição e cancelamento de consulta são exclusivos do veterinário na API — o tutor só visualiza. */
const ConsultaCard = ({ consulta, onPress, onMarcarRealizada }: ConsultaCardProps) => {
  const { data, hora } = formatarDataHora(consulta.dataHora);
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} className="bg-surface-container-low rounded-2xl p-5 gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-on-surface font-bold font-headline text-base">
          {consulta.nomeVeterinario}
        </Text>
        <View className={`px-3 py-1 rounded-full ${STATUS_COLORS[consulta.status]}`}>
          <Text className={`text-xs font-bold font-headline uppercase ${STATUS_TEXT_COLORS[consulta.status]}`}>
            {STATUS_LABELS[consulta.status]}
          </Text>
        </View>
      </View>

      <Text className="text-on-surface-variant font-body text-sm">
        {consulta.nomeUnidade} · {consulta.nomePet}
      </Text>

      <View className="flex-row items-center justify-between pt-2 border-t border-outline-variant">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="calendar-today" size={16} color="#404943" />
          <Text className="text-on-surface-variant font-body text-sm">
            {data} às {hora}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {consulta.status === "AGENDADA" && consulta.tipo === "TELECONSULTA" && (
            <TouchableOpacity
              onPress={() =>
                router.navigate({
                  pathname: "/teleconsulta",
                  params: { id: consulta.id.toString() },
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
          {consulta.status === "AGENDADA" && onMarcarRealizada && (
            <TouchableOpacity
              onPress={onMarcarRealizada}
              className="flex-row items-center gap-2 bg-surface-container-highest px-3 py-2 rounded-xl"
            >
              <MaterialIcons name="check-circle-outline" size={18} color="#404943" />
              <Text className="text-on-surface-variant font-headline font-bold text-xs uppercase">
                Realizada
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default ConsultaCard;
