import MyTextInput from "@/components/MyTextInput";
import { useLembretes } from "@/hooks/useLembretes";
import { useEditarLembreteMutation } from "@/hooks/useEditarLembreteMutation";
import { usePets } from "@/hooks/usePets";
import { iconeDaEspecie } from "@/utils/petIcon";
import { paraDataIso } from "@/utils/data";
import {
  LembreteInput,
  LembreteSchema,
  TIPOS_LEMBRETE,
  TIPO_LEMBRETE_LABEL,
} from "@/schemas/lembrete.schema";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditLembreteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lembreteId = Number(id);

  const { data: lembretes = [], isLoading } = useLembretes();
  const { data: pets = [] } = usePets();
  const lembrete = lembretes.find((l) => l.id === lembreteId);

  const { mutate: editarLembrete, isPending, isError, isSuccess, error } = useEditarLembreteMutation(lembreteId);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LembreteInput>({
    values: lembrete
      ? {
          mensagem: lembrete.mensagem,
          dataAgendada: lembrete.dataAgendada,
          tipo: lembrete.tipo,
          petId: lembrete.petId,
        }
      : undefined,
    resolver: zodResolver(LembreteSchema),
  });

  const handleSave = (data: LembreteInput) => {
    editarLembrete(data);
  };

  // O estado da mutation controla a navegação: assim que salva, volta para
  // o calendário sozinho.
  useEffect(() => {
    if (isSuccess) {
      router.back();
    }
  }, [isSuccess]);

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
            Editar Lembrete
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Atualize as informações do lembrete.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Mensagem */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Mensagem
            </Text>
            <MyTextInput
              name="mensagem"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: Vacina V8"
            />
          </View>

          {/* Data */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Data
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-on-surface font-medium">
                {(lembrete ? new Date(lembrete.dataAgendada + "T00:00:00") : date).toLocaleDateString("pt-BR")}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                    setValue("dataAgendada", paraDataIso(selectedDate));
                  }
                }}
              />
            )}
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
                  {TIPOS_LEMBRETE.map((t) => (
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
                          value === t
                            ? "text-on-primary-container"
                            : "text-on-surface"
                        }`}
                      >
                        {TIPO_LEMBRETE_LABEL[t]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {errors.tipo && (
                    <Text className="text-red-500 text-xs">
                      {errors.tipo.message}
                    </Text>
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
                        <Text className="text-xl">
                          {iconeDaEspecie(pet.especie)}
                        </Text>
                        <Text
                          className={`font-bold font-headline ${
                            value === pet.id
                              ? "text-on-primary-container"
                              : "text-on-surface"
                          }`}
                        >
                          {pet.nome}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                  {errors.petId && (
                    <Text className="text-red-500 text-xs">
                      {errors.petId.message}
                    </Text>
                  )}
                </View>
              )}
            />
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
