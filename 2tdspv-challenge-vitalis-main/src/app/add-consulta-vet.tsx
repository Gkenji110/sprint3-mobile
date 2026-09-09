import { useAgendarConsultaMutation } from "@/hooks/useAgendarConsultaMutation";
import { usePets } from "@/hooks/usePets";
import { useUnidades } from "@/hooks/useUnidades";
import { iconeDaEspecie } from "@/utils/petIcon";
import { paraDataHoraIso } from "@/utils/data";
import {
  ConsultaAgendarInput,
  ConsultaAgendarSchema,
  TIPOS_CONSULTA,
  TIPO_CONSULTA_LABEL,
} from "@/schemas/consultaVeterinario.schema";
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

export default function AddConsultaVetScreen() {
  const { mutate: agendarConsulta, isPending, isError, error } = useAgendarConsultaMutation();
  const { data: pets = [] } = usePets();
  const { data: unidades = [], isLoading: carregandoUnidades } = useUnidades();

  const [dataHora, setDataHora] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultaAgendarInput>({
    defaultValues: {
      petId: undefined,
      unidadeId: undefined,
      tipo: undefined,
      dataHora: paraDataHoraIso(new Date()),
      observacoes: "",
    },
    resolver: zodResolver(ConsultaAgendarSchema),
  });

  const handleAgendar = (data: ConsultaAgendarInput) => {
    agendarConsulta({ ...data, observacoes: data.observacoes || undefined });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Nova Consulta
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Agende uma consulta para um paciente.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Data e hora */}
          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Data
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
              >
                <Text className="text-on-surface font-medium">
                  {dataHora.toLocaleDateString("pt-BR")}
                </Text>
                <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dataHora}
                  mode="date"
                  display="default"
                  onChange={(event, selecionada) => {
                    setShowDatePicker(false);
                    if (selecionada) {
                      const nova = new Date(dataHora);
                      nova.setFullYear(selecionada.getFullYear(), selecionada.getMonth(), selecionada.getDate());
                      setDataHora(nova);
                      setValue("dataHora", paraDataHoraIso(nova));
                    }
                  }}
                />
              )}
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Hora
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
              >
                <Text className="text-on-surface font-medium">
                  {dataHora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <MaterialIcons name="access-time" size={20} color="#02C39A" />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={dataHora}
                  mode="time"
                  display="default"
                  onChange={(event, selecionada) => {
                    setShowTimePicker(false);
                    if (selecionada) {
                      const nova = new Date(dataHora);
                      nova.setHours(selecionada.getHours(), selecionada.getMinutes(), 0);
                      setDataHora(nova);
                      setValue("dataHora", paraDataHoraIso(nova));
                    }
                  }}
                />
              )}
            </View>
          </View>

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
                  {TIPOS_CONSULTA.map((t) => (
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
                        {TIPO_CONSULTA_LABEL[t]}
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

          {/* Unidade — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="local-hospital" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Unidade
              </Text>
            </View>
            {carregandoUnidades ? (
              <ActivityIndicator color="#02C39A" />
            ) : (
              <Controller
                control={control}
                name="unidadeId"
                render={({ field: { onChange, value } }) => (
                  <View className="gap-3">
                    {unidades.length === 0 ? (
                      <Text className="text-on-surface-variant font-body text-sm">
                        Nenhuma unidade cadastrada. Cadastre uma unidade antes de agendar.
                      </Text>
                    ) : (
                      unidades.map((unidade) => (
                        <TouchableOpacity
                          key={unidade.id}
                          onPress={() => onChange(unidade.id)}
                          className={`flex-row items-center gap-3 p-3 rounded-xl border-2 ${
                            value === unidade.id
                              ? "bg-primary-container border-primary"
                              : "bg-surface-container-lowest border-transparent"
                          }`}
                        >
                          <Text
                            className={`font-bold font-headline ${
                              value === unidade.id ? "text-on-primary-container" : "text-on-surface"
                            }`}
                          >
                            {unidade.nome}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                    {errors.unidadeId && (
                      <Text className="text-red-500 text-xs">{errors.unidadeId.message}</Text>
                    )}
                  </View>
                )}
              />
            )}
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

          {/* Observações */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Observações (opcional)
            </Text>
            <MyTextInput
              name="observacoes"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Retorno pós-cirúrgico"
            />
          </View>

          {/* Erro da mutation */}
          {isError && (
            <Text className="text-red-500 text-center font-body">{error.message}</Text>
          )}

          {/* Botão Agendar */}
          <TouchableOpacity
            onPress={handleSubmit(handleAgendar)}
            disabled={isPending}
            style={{ opacity: isPending ? 0.6 : 1 }}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="event-available" size={24} color="white" />
                <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                  Agendar Consulta
                </Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
