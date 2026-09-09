import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { VacinaTratamentoApiResponse } from "@/services/vacinaTratamento.service";
import { TIPO_VACINA_TRATAMENTO_LABEL } from "@/schemas/vacinaTratamentoVeterinario.schema";
import { paraDataBr } from "@/utils/data";

interface VacinaTratamentoCardProps {
  item: VacinaTratamentoApiResponse;
  /** Só o veterinário edita — o tutor não passa isso, e o card vira só leitura. */
  onPress?: () => void;
  onDelete?: () => void;
}

const ICONE_POR_TIPO: Record<VacinaTratamentoApiResponse["tipo"], keyof typeof MaterialIcons.glyphMap> = {
  VACINA: "vaccines",
  MEDICAMENTO: "medication",
  PROCEDIMENTO: "healing",
};

/** Registrar, editar e excluir vacina/tratamento são exclusivos do veterinário na API — o tutor só visualiza. */
const VacinaTratamentoCard = ({ item, onPress, onDelete }: VacinaTratamentoCardProps) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} className="bg-surface-container-low rounded-2xl p-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="bg-primary-container w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name={ICONE_POR_TIPO[item.tipo]} size={18} color="#00382a" />
        </View>
        <View className="flex-1">
          <Text className="text-on-surface font-bold font-headline">
            {item.nome}
          </Text>
          <Text className="text-on-surface-variant font-body text-xs uppercase tracking-wide">
            {TIPO_VACINA_TRATAMENTO_LABEL[item.tipo]} · {item.nomePet}
          </Text>
          <Text className="text-on-surface-variant font-body text-sm">
            Aplicada: {paraDataBr(item.dataAplicacao)}
          </Text>
          {item.proximaDose ? (
            <Text className="text-primary font-body text-sm font-semibold">
              Próxima: {paraDataBr(item.proximaDose)}
            </Text>
          ) : null}
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      )}
    </Wrapper>
  );
};

export default VacinaTratamentoCard;
