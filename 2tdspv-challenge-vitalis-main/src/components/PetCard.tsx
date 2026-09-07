import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { PetInput } from "@/schemas/pet.schema";

interface PetCardProps {
  pet: PetInput;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PetCard = ({ pet, onPress, onEdit, onDelete }: PetCardProps) => {
  return (
    <View className="bg-surface-container-low rounded-2xl p-5">
      <View className="flex-row items-center justify-between">

        {/* Info do pet */}
        <TouchableOpacity
          onPress={onPress}
          className="flex-row items-center gap-4 flex-1"
        >
          <View className="bg-primary-container w-14 h-14 rounded-full items-center justify-center">
            <Text className="text-2xl">
              {pet.especie === "Cachorro"
                ? "🐶"
                : pet.especie === "Gato"
                ? "🐱"
                : pet.especie === "Pássaro"
                ? "🐦"
                : "🐾"}
            </Text>
          </View>
          <View>
            <Text className="text-on-surface font-bold font-headline text-lg">
              {pet.nome}
            </Text>
            <Text className="text-on-surface-variant font-body text-sm">
              {pet.especie} · {pet.raca}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botões de ação */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onEdit}>
            <MaterialIcons name="edit" size={22} color="#02C39A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default PetCard;