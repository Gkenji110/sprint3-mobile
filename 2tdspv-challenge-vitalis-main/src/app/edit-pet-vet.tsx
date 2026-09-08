import MyTextInput from "@/components/MyTextInput";
import { useEditarPetMutation } from "@/hooks/useEditarPetMutation";
import { usePets } from "@/hooks/usePets";
import {
  ESPECIES,
  PetVeterinarioInput,
  PetVeterinarioSchema,
  SEXOS,
} from "@/schemas/petVeterinario.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditPetVetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = Number(id);

  const { data: pets = [], isLoading } = usePets();
  const pet = pets.find((p) => p.id === petId);

  const { mutate: editarPet, isPending, isError, error } = useEditarPetMutation(petId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetVeterinarioInput>({
    // A API guarda espécie/gênero como texto livre (ex.: "Cão"), então um
    // valor fora do conjunto fixo do formulário simplesmente não vem
    // pré-selecionado — o veterinário escolhe de novo pra salvar.
    values: (pet
      ? {
          nome: pet.nome,
          // A espécie/gênero pré-selecionam só quando batem com uma das
          // opções fixas do formulário (a API guarda texto livre, ex.:
          // "Cão"); fora disso, o campo some sem selecionado e o
          // veterinário escolhe de novo pra salvar — daí o cast abaixo.
          especie: ESPECIES.includes(pet.especie as (typeof ESPECIES)[number])
            ? (pet.especie as (typeof ESPECIES)[number])
            : undefined,
          raca: pet.raca ?? "",
          idade: pet.idade !== undefined ? String(pet.idade) : "",
          peso: pet.peso !== undefined ? String(pet.peso) : "",
          genero: SEXOS.includes(pet.genero as (typeof SEXOS)[number])
            ? (pet.genero as (typeof SEXOS)[number])
            : undefined,
          responsavelCpf: "",
        }
      : undefined) as PetVeterinarioInput | undefined,
    resolver: zodResolver(PetVeterinarioSchema),
  });

  const handleSave = (data: PetVeterinarioInput) => {
    editarPet({
      nome: data.nome,
      especie: data.especie,
      raca: data.raca || undefined,
      idade: data.idade ? Number(data.idade) : undefined,
      peso: data.peso ? Number(data.peso) : undefined,
      genero: data.genero,
      responsavelCpf: data.responsavelCpf,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#02C39A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Editar Pet
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            {pet?.nomeResponsavel
              ? `Tutor atual: ${pet.nomeResponsavel}. Informe o CPF para confirmar ou trocar o tutor.`
              : "Informe o CPF do tutor para confirmar ou trocar o vínculo."}
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Nome do pet
            </Text>
            <MyTextInput
              name="nome"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Rex"
            />
          </View>

          {/* CPF do responsável */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              CPF do tutor
            </Text>
            <MyTextInput
              name="responsavelCpf"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Somente números"
              keyboardType="number-pad"
              maxLength={11}
            />
          </View>

          {/* Espécie — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="pets" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Espécie
              </Text>
            </View>
            <Controller
              control={control}
              name="especie"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {ESPECIES.map((especie) => (
                    <TouchableOpacity
                      key={especie}
                      onPress={() => onChange(especie)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        value === especie
                          ? "bg-primary-container border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline text-sm ${
                          value === especie
                            ? "text-on-primary-container"
                            : "text-on-surface"
                        }`}
                      >
                        {especie}
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

          {/* Gênero — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="wc" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Gênero (opcional)
              </Text>
            </View>
            <Controller
              control={control}
              name="genero"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {SEXOS.map((sexo) => (
                    <TouchableOpacity
                      key={sexo}
                      onPress={() => onChange(value === sexo ? undefined : sexo)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        value === sexo
                          ? "bg-primary-container border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline text-sm ${
                          value === sexo
                            ? "text-on-primary-container"
                            : "text-on-surface"
                        }`}
                      >
                        {sexo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Raça */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Raça (opcional)
            </Text>
            <MyTextInput
              name="raca"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Labrador"
            />
          </View>

          {/* Idade e Peso */}
          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Idade (opcional)
              </Text>
              <MyTextInput
                name="idade"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Anos"
                keyboardType="number-pad"
              />
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Peso (opcional)
              </Text>
              <MyTextInput
                name="peso"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Kg"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Erro da mutation */}
          {isError && (
            <Text className="text-red-500 text-center font-body">
              {error.message}
            </Text>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={isPending}
            style={{ opacity: isPending ? 0.6 : 1 }}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="save" size={24} color="white" />
                <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                  Salvar Alterações
                </Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
