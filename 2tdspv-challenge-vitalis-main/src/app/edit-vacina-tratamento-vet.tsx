import { useMemo, useState } from "react";
import { useVacinasTratamentos } from "@/hooks/useVacinasTratamentos";
import { useEditarVacinaTratamentoMutation } from "@/hooks/useEditarVacinaTratamentoMutation";
import { usePets } from "@/hooks/usePets";
import { paraDataIso } from "@/utils/data";
import {
  TIPOS_VACINA_TRATAMENTO,
  TIPO_VACINA_TRATAMENTO_LABEL,
  VacinaTratamentoEditarInput,
  VacinaTratamentoEditarSchema,
} from "@/schemas/vacinaTratamentoVeterinario.schema";
import MyTextInput from "@/components/MyTextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
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

export default function EditVacinaTratamentoVetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = Number(id);

  const { data: itens = [], isLoading } = useVacinasTratamentos();
  const item = itens.find((i) => i.id === itemId);

  const { data: pets = [] } = usePets();

  /**
   * `GET /api/vacinas-tratamentos` não devolve `petId` (só `nomePet`) — o
   * PUT exige o campo mesmo assim (validação do backend, ver comentário em
   * `useEditarVacinaTratamentoMutation`), então achamos de volta casando o
   * nome contra a lista de pacientes do veterinário. Se não for único, a
   * edição fica bloqueada em vez de arriscar salvar com o ID errado.
   */
  const petCorrespondente = useMemo(
    () => (item ? pets.filter((p) => p.nome === item.nomePet) : []),
    [item, pets],
  );
  const petId = petCorrespondente.length === 1 ? petCorrespondente[0].id : undefined;

  const { mutate: salvar, isPending, isError, error } = useEditarVacinaTratamentoMutation(
    itemId,
    petId ?? 0,
  );

  const [dataAplicacao, setDataAplicacao] = useState<Date | undefined>(undefined);
  const [showDataAplicacao, setShowDataAplicacao] = useState(false);
  const [dataProximaDose, setDataProximaDose] = useState<Date | undefined>(undefined);
  const [showProximaDose, setShowProximaDose] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VacinaTratamentoEditarInput>({
    values: item
      ? {
          tipo: item.tipo,
          nome: item.nome,
          dataAplicacao: item.dataAplicacao,
          proximaDose: item.proximaDose ?? "",
          dose: item.dose ?? "",
          observacoes: item.observacoes ?? "",
        }
      : undefined,
    resolver: zodResolver(VacinaTratamentoEditarSchema),
  });

  const handleSalvar = (data: VacinaTratamentoEditarInput) => {
    Alert.alert(
      "Salvar Alterações",
      "Deseja salvar as alterações deste registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: () =>
            salvar({
              ...data,
              proximaDose: data.proximaDose || undefined,
              dose: data.dose || undefined,
              observacoes: data.observacoes || undefined,
            }),
        },
      ]
    );
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
            Editar Vacina
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            {item ? `Registro de ${item.nomePet}.` : "Atualize as informações do registro."}
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {petId === undefined && (
            <Text className="text-red-500 font-body text-sm -mt-2">
              Não foi possível confirmar o pet deste registro (nome não encontrado ou
              duplicado entre seus pacientes). Salvar está desabilitado.
            </Text>
          )}

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
                {(dataAplicacao ?? (item ? new Date(item.dataAplicacao + "T00:00:00") : new Date())).toLocaleDateString("pt-BR")}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showDataAplicacao && (
              <DateTimePicker
                value={dataAplicacao ?? (item ? new Date(item.dataAplicacao + "T00:00:00") : new Date())}
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
                {(dataProximaDose ?? (item?.proximaDose ? new Date(item.proximaDose + "T00:00:00") : undefined))?.toLocaleDateString("pt-BR") ?? "Nenhuma"}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showProximaDose && (
              <DateTimePicker
                value={dataProximaDose ?? (item?.proximaDose ? new Date(item.proximaDose + "T00:00:00") : new Date())}
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

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSubmit(handleSalvar)}
            disabled={isPending || petId === undefined}
            style={{ opacity: isPending || petId === undefined ? 0.6 : 1 }}
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
