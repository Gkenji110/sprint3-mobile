import { useRegistrarVacinaTratamentoMutation } from "@/hooks/useRegistrarVacinaTratamentoMutation";
import { usePets } from "@/hooks/usePets";
import { iconeDaEspecie } from "@/utils/petIcon";
import { paraDataIso } from "@/utils/data";
import {
  TIPOS_VACINA_TRATAMENTO,
  TIPO_VACINA_TRATAMENTO_LABEL,
  VacinaTratamentoRegistrarInput,
  VacinaTratamentoRegistrarSchema,
} from "@/schemas/vacinaTratamentoVeterinario.schema";
import MyTextInput from "@/components/MyTextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddVacinaTratamentoVetScreen() {
  const { mutate: registrar, isPending, isError, error } = useRegistrarVacinaTratamentoMutation();
  const { data: pets = [] } = usePets();

  const [dataAplicacao, setDataAplicacao] = useState(new Date());
  const [showDataAplicacao, setShowDataAplicacao] = useState(false);
  const [dataProximaDose, setDataProximaDose] = useState<Date | undefined>(undefined);
  const [showProximaDose, setShowProximaDose] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VacinaTratamentoRegistrarInput>({
    defaultValues: {
      petId: undefined,
      tipo: undefined,
      nome: "",
      dataAplicacao: paraDataIso(new Date()),
      proximaDose: "",
      dose: "",
      observacoes: "",
    },
    resolver: zodResolver(VacinaTratamentoRegistrarSchema),
  });

  const handleRegistrar = (data: VacinaTratamentoRegistrarInput) => {
    registrar({
      ...data,
      proximaDose: data.proximaDose || undefined,
      dose: data.dose || undefined,
      observacoes: data.observacoes || undefined,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Nova Vacina
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Registre uma vacina, medicamento ou procedimento para um paciente.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Tipo — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="category" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Tipo
              </Text>
            </View>
            <Controller
              control={control}
              name="tipo"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {TIPOS_VACINA_TRATAMENTO.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => onChange(t)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        value === t
                          ? "bg-primary-container border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline text-sm ${
                          value === t ? "text-on-primary-container" : "text-on-surface"
                        }`}
                      >
                        {TIPO_VACINA_TRATAMENTO_LABEL[t]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {errors.tipo && (
                    <Text className="text-red-500 text-xs">{errors.tipo.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Pet — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="pets" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Pet
              </Text>
            </View>
            <Controller
              control={control}
              name="petId"
              render={({ field: { onChange, value } }) => (
                <View className="gap-3">
                  {pets.length === 0 ? (
                    <Text className="text-on-surface-variant font-body text-sm">
                      Nenhum pet cadastrado.
                    </Text>
                  ) : (
                    pets.map((pet) => (
                      <TouchableOpacity
                        key={pet.id}
                        onPress={() => onChange(pet.id)}
                        className={`flex-row items-center gap-3 p-3 rounded-xl border-2 ${
                          value === pet.id
                            ? "bg-primary-container border-primary"
                            : "bg-surface-container-lowest border-transparent"
                        }`}
                      >
                        <Text className="text-xl">{iconeDaEspecie(pet.especie)}</Text>
                        <Text
                          className={`font-bold font-headline ${
                            value === pet.id ? "text-on-primary-container" : "text-on-surface"
                          }`}
                        >
                          {pet.nome}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                  {errors.petId && (
                    <Text className="text-red-500 text-xs">{errors.petId.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Nome
            </Text>
            <MyTextInput
              name="nome"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: V10, Antirrábica, Castração"
            />
          </View>

          {/* Data de Aplicação */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Data de Aplicação
            </Text>
            <TouchableOpacity
              onPress={() => setShowDataAplicacao(true)}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-on-surface font-medium">
                {dataAplicacao.toLocaleDateString("pt-BR")}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showDataAplicacao && (
              <DateTimePicker
                value={dataAplicacao}
                mode="date"
                display="default"
                onChange={(event, selecionada) => {
                  setShowDataAplicacao(false);
                  if (selecionada) {
                    setDataAplicacao(selecionada);
                    setValue("dataAplicacao", paraDataIso(selecionada));
                  }
                }}
              />
            )}
          </View>

          {/* Próxima Dose */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Próxima Dose (opcional)
            </Text>
            <TouchableOpacity
              onPress={() => setShowProximaDose(true)}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-on-surface font-medium">
                {dataProximaDose ? dataProximaDose.toLocaleDateString("pt-BR") : "Nenhuma"}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showProximaDose && (
              <DateTimePicker
                value={dataProximaDose ?? new Date()}
                mode="date"
                display="default"
                onChange={(event, selecionada) => {
                  setShowProximaDose(false);
                  if (selecionada) {
                    setDataProximaDose(selecionada);
                    setValue("proximaDose", paraDataIso(selecionada));
                  }
                }}
              />
            )}
          </View>

          {/* Dose */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Dose (opcional)
            </Text>
            <MyTextInput
              name="dose"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: 1ª dose"
            />
          </View>

          {/* Observações */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Observações (opcional)
            </Text>
            <MyTextInput
              name="observacoes"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Sem reações adversas"
            />
          </View>

          {/* Erro da mutation */}
          {isError && (
            <Text className="text-red-500 text-center font-body">{error.message}</Text>
          )}

          {/* Botão Registrar */}
          <TouchableOpacity
            onPress={handleSubmit(handleRegistrar)}
            disabled={isPending}
            style={{ opacity: isPending ? 0.6 : 1 }}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="vaccines" size={24} color="white" />
                <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                  Registrar
                </Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
