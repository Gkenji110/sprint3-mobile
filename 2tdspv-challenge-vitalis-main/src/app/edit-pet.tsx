import MyTextInput from "@/components/MyTextInput";
import { usePet } from "@/context/PetContext";
import { ESPECIES, PetInput, PetSchema, SEXOS } from "@/schemas/pet.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditPetScreen() {
  const { index, pet } = useLocalSearchParams<{
    index: string;
    pet: string;
  }>();

  const { updatePet } = usePet();

  const petData: PetInput = JSON.parse(pet);
  const petIndex = parseInt(index);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetInput>({
    defaultValues: {
      nome: petData.nome,
      especie: petData.especie,
      raca: petData.raca,
      peso: petData.peso,
      sexo: petData.sexo,
    },
    resolver: zodResolver(PetSchema),
  });

  const handleSave = (data: PetInput) => {
    updatePet(petIndex, data);
    Alert.alert("Sucesso", "Pet atualizado com sucesso!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Editar Pet
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Atualize as informações do seu pet.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Nome
            </Text>
            <MyTextInput
              name="nome"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Rex"
            />
          </View>

          {/* Raça */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Raça
            </Text>
            <MyTextInput
              name="raca"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Golden Retriever"
            />
          </View>

          {/* Peso */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Peso (kg)
            </Text>
            <MyTextInput
              name="peso"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: 8.5"
              keyboardType="numeric"
            />
          </View>

          {/* Espécie — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="category" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Espécie
              </Text>
            </View>
            <Controller
              control={control}
              name="especie"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {ESPECIES.map((e) => (
                    <TouchableOpacity
                      key={e}
                      onPress={() => onChange(e)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        value === e
                          ? "bg-primary-container border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline text-sm ${
                          value === e
                            ? "text-on-primary-container"
                            : "text-on-surface"
                        }`}
                      >
                        {e}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {errors.especie && (
                    <Text className="text-red-500 text-xs">
                      {errors.especie.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Sexo — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="male" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Sexo
              </Text>
            </View>
            <Controller
              control={control}
              name="sexo"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-3">
                  {SEXOS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => onChange(s)}
                      className={`flex-1 h-12 items-center justify-center rounded-xl ${
                        value === s
                          ? "bg-primary"
                          : "bg-surface-container-lowest"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline ${
                          value === s ? "text-white" : "text-on-surface"
                        }`}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {errors.sexo && (
                    <Text className="text-red-500 text-xs">
                      {errors.sexo.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            <MaterialIcons name="save" size={24} color="white" />
            <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
              Salvar Alterações
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}