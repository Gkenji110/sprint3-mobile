import { useAtualizarConsultaMutation } from "@/hooks/useAtualizarConsultaMutation";
import { useConsultas } from "@/hooks/useConsultas";
import { usePets } from "@/hooks/usePets";
import { useUnidades } from "@/hooks/useUnidades";
import { paraDataHoraIso } from "@/utils/data";
import {
  ConsultaEditarInput,
  ConsultaEditarSchema,
  STATUS_CONSULTA,
  STATUS_CONSULTA_LABEL,
  TIPOS_CONSULTA,
  TIPO_CONSULTA_LABEL,
} from "@/schemas/consultaVeterinario.schema";
import MyTextInput from "@/components/MyTextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditConsultaVetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const consultaId = Number(id);

  const { data: consultas = [], isLoading } = useConsultas();
  const consulta = consultas.find((c) => c.id === consultaId);

  const { data: pets = [] } = usePets();
  const { data: unidades = [] } = useUnidades();
  // `GET /api/consultas` não devolve petId nem unidadeId, só os nomes — é a
  // única pista disponível pra achar os dois de volta (ver comentário em
  // `consulta.service.ts`). Se o nome não for único, ou o registro não
  // estiver mais na lista, não dá pra confirmar qual é o certo, e por
  // segurança a tela bloqueia o salvar em vez de arriscar o ID errado —
  // unidadeId em especial: mandar um errado moveria a consulta de unidade
  // de verdade, ao contrário do petId, que o backend só valida e ignora.
  const petCorrespondente = useMemo(
    () => (consulta ? pets.filter((p) => p.nome === consulta.nomePet) : []),
    [consulta, pets],
  );
  const petId = petCorrespondente.length === 1 ? petCorrespondente[0].id : undefined;

  const unidadeCorrespondente = useMemo(
    () => (consulta ? unidades.filter((u) => u.nome === consulta.nomeUnidade) : []),
    [consulta, unidades],
  );
  const unidadeId = unidadeCorrespondente.length === 1 ? unidadeCorrespondente[0].id : undefined;

  const [dataHora, setDataHora] = useState(() =>
    consulta ? new Date(consulta.dataHora) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultaEditarInput>({
    values: consulta
      ? {
          tipo: consulta.tipo,
          dataHora: consulta.dataHora,
          status: consulta.status,
          observacoes: consulta.observacoes ?? "",
        }
      : undefined,
    resolver: zodResolver(ConsultaEditarSchema),
  });

  const {
    mutate: salvarConsulta,
    isPending,
    isError,
    isSuccess,
    error,
  } = useAtualizarConsultaMutation(consultaId, petId ?? 0, unidadeId ?? 0);

  const handleSalvar = (data: ConsultaEditarInput) => {
    Alert.alert(
      "Salvar Alterações",
      "Deseja salvar as alterações desta consulta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: () =>
            salvarConsulta({ ...data, observacoes: data.observacoes || undefined }),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#02C39A" />
      </SafeAreaView>
    );
  }

  if (!consulta) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-6">
        <Text className="text-on-surface font-bold font-headline text-xl text-center">
          Consulta não encontrada
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Editar Consulta
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            {consulta.nomePet} · {consulta.nomeUnidade}
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {(petId === undefined || unidadeId === undefined) && (
            <View className="bg-red-100 rounded-2xl p-4">
              <Text className="text-red-700 font-body text-sm">
                Não foi possível confirmar de forma única {petId === undefined && unidadeId === undefined
                  ? "o pet e a unidade desta consulta"
                  : petId === undefined
                    ? "o pet desta consulta"
                    : "a unidade desta consulta"}{" "}
                na sua lista, então salvar está desabilitado por segurança.
              </Text>
            </View>
          )}

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
                </View>
              )}
            />
          </View>

          {/* Status — Controller */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="flag" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Status
              </Text>
            </View>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-3">
                  {STATUS_CONSULTA.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => onChange(s)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        value === s
                          ? "bg-primary-container border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline text-sm ${
                          value === s ? "text-on-primary-container" : "text-on-surface"
                        }`}
                      >
                        {STATUS_CONSULTA_LABEL[s]}
                      </Text>
                    </TouchableOpacity>
                  ))}
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

          {/* Estado da mutation */}
          {isError && (
            <Text className="text-red-500 text-center font-body">{error.message}</Text>
          )}
          {isSuccess && (
            <Text className="text-primary text-center font-body font-bold">
              Consulta atualizada com sucesso!
            </Text>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSubmit(handleSalvar)}
            disabled={isPending || petId === undefined || unidadeId === undefined}
            style={{ opacity: isPending || petId === undefined || unidadeId === undefined ? 0.6 : 1 }}
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
