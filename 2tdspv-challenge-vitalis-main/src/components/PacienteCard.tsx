import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { PetApiResponse } from "@/services/pet.service";
import { iconeDaEspecie } from "@/utils/petIcon";

interface PacienteCardProps {
  pet: PetApiResponse;
  onPress: () => void;
  onDelete: () => void;
}

/** Card de pet na visão do veterinário — com dono e ações de editar/excluir. */
const PacienteCard = ({ pet, onPress, onDelete }: PacienteCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-surface-container-low rounded-2xl p-5"
    >
      <View className="flex-row items-center gap-4">
        <View className="bg-primary-container w-12 h-12 rounded-full items-center justify-center">
          <Text className="text-2xl">{iconeDaEspecie(pet.especie)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-on-surface font-bold font-headline text-base">
            {pet.nome}
          </Text>
          <Text className="text-on-surface-variant font-body text-sm">
            {pet.especie}{pet.raca ? ` · ${pet.raca}` : ""}
          </Text>
          {pet.nomeResponsavel && (
            <Text className="text-primary font-body text-sm font-semibold mt-1">
              Tutor: {pet.nomeResponsavel}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PacienteCard;
