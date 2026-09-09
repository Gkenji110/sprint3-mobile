import { Text, TouchableOpacity, View } from "react-native";
import { iconeDaEspecie } from "@/utils/petIcon";

/**
 * Formato mínimo que o card precisa — hoje sempre um `PetApiResponse`, mas
 * fica desacoplado do tipo da API pra não amarrar o componente a um serviço.
 */
interface PetCardData {
  nome: string;
  especie: string;
  raca?: string | null;
}

/** Cadastro e edição de pet são exclusivos do veterinário na API — o tutor só visualiza. */
interface PetCardProps {
  pet: PetCardData;
  onPress: () => void;
}

const PetCard = ({ pet, onPress }: PetCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface-container-low rounded-2xl p-5 flex-row items-center gap-4"
    >
      <View className="bg-primary-container w-14 h-14 rounded-full items-center justify-center">
        <Text className="text-2xl">{iconeDaEspecie(pet.especie)}</Text>
      </View>
      <View>
        <Text className="text-on-surface font-bold font-headline text-lg">
          {pet.nome}
        </Text>
        <Text className="text-on-surface-variant font-body text-sm">
          {pet.especie}{pet.raca ? ` · ${pet.raca}` : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;
