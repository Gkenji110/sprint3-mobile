import MyTextInput from "@/components/MyTextInput";
import { useLembrete } from "@/context/LembreteContext";
import { usePets } from "@/hooks/usePets";
import { iconeDaEspecie } from "@/utils/petIcon";
import {
  LembreteInput,
  LembreteSchema,
  TIPOS_LEMBRETE,
} from "@/schemas/lembrete.schema";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddLembreteScreen() {
  const router = useRouter();
  const { addLembrete } = useLembrete();
  const { data: pets = [] } = usePets();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<LembreteInput>({
    defaultValues: {
      titulo: "",
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      tipo: undefined,
      petNome: "",
    },
    resolver: zodResolver(LembreteSchema),
  });

  const handleAdd = (formData: LembreteInput) => {
    console.log("formData", formData);
    addLembrete(formData);
    Alert.alert("Sucesso", "Lembrete cadastrado com sucesso!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Novo Lembrete
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Adicione um lembrete de saúde para seu pet.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Título */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Título
            </Text>
            <MyTextInput
              name="titulo"
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
                {date.toLocaleDateString("pt-BR")}
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
                    setValue("data", selectedDate.toLocaleDateString("pt-BR"));
                  }
                }}
              />
            )}
          </View>

          {/* Hora */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Hora
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-on-surface font-medium">
                {date.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <MaterialIcons name="schedule" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                    setValue(
                      "hora",
                      selectedDate.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    );
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
                        {t}
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
              name="petNome"
              render={({ field: { onChange, value } }) => (
                <View className="gap-3">
                  {pets.length === 0 ? (
                    <Text className="text-on-surface-variant font-body text-sm">
                      Nenhum pet cadastrado. Cadastre um pet primeiro!
                    </Text>
                  ) : (
                    pets.map((pet, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onChange(pet.nome)}
                        className={`flex-row items-center gap-3 p-3 rounded-xl border-2 ${
                          value === pet.nome
                            ? "bg-primary-container border-primary"
                            : "bg-surface-container-lowest border-transparent"
                        }`}
                      >
                        <Text className="text-xl">
                          {iconeDaEspecie(pet.especie)}
                        </Text>
                        <Text
                          className={`font-bold font-headline ${
                            value === pet.nome
                              ? "text-on-primary-container"
                              : "text-on-surface"
                          }`}
                        >
                          {pet.nome}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                  {errors.petNome && (
                    <Text className="text-red-500 text-xs">
                      {errors.petNome.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity
            onPress={handleSubmit(handleAdd)}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            <MaterialIcons name="calendar-today" size={24} color="white" />
            <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
              Cadastrar Lembrete
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}