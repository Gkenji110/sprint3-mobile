import MyTextInput from "@/components/MyTextInput";
import { useCriarPetMutation } from "@/hooks/useCriarPetMutation";
import {
  ESPECIES,
  PetVeterinarioInput,
  PetVeterinarioSchema,
  SEXOS,
} from "@/schemas/petVeterinario.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPetVetScreen() {
  const { mutate: criarPet, isPending, isError, error } = useCriarPetMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetVeterinarioInput>({
    defaultValues: {
      nome: "",
      especie: undefined,
      raca: "",
      idade: "",
      peso: "",
      genero: undefined,
      responsavelCpf: "",
    },
    resolver: zodResolver(PetVeterinarioSchema),
  });

  const handleAdd = (data: PetVeterinarioInput) => {
    criarPet({
      nome: data.nome,
      especie: data.especie,
      raca: data.raca || undefined,
      idade: data.idade ? Number(data.idade) : undefined,
      peso: data.peso ? Number(data.peso) : undefined,
      genero: data.genero,
      responsavelCpf: data.responsavelCpf,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Novo Pet
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Cadastre um pet e vincule ao tutor pelo CPF.
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

          {/* Botão Cadastrar */}
          <TouchableOpacity
            onPress={handleSubmit(handleAdd)}
            disabled={isPending}
            style={{ opacity: isPending ? 0.6 : 1 }}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="pets" size={24} color="white" />
                <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                  Cadastrar Pet
                </Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
