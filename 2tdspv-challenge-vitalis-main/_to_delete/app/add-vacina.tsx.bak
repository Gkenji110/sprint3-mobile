import MyTextInput from "@/components/MyTextInput";
import { useVacina } from "@/context/VacinaContext";
import { STATUS_VACINA, VacinaInput, VacinaSchema } from "@/schemas/vacina.schema";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
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

export default function AddVacinaScreen() {
  const { petIndex } = useLocalSearchParams<{ petIndex: string }>();
  const { addVacina } = useVacina();

  const [dateAplicacao, setDateAplicacao] = useState(new Date());
  const [dateProxima, setDateProxima] = useState(new Date());
  const [showDateAplicacao, setShowDateAplicacao] = useState(false);
  const [showDateProxima, setShowDateProxima] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VacinaInput>({
    defaultValues: {
      nome: "",
      dataAplicacao: new Date().toLocaleDateString("pt-BR"),
      proximaDose: "",
      status: undefined,
      petIndex: parseInt(petIndex),
    },
    resolver: zodResolver(VacinaSchema),
  });

  const handleAdd = (data: VacinaInput) => {
    addVacina({ ...data, petIndex: parseInt(petIndex) });
    Alert.alert("Sucesso", "Vacina cadastrada com sucesso!", [
      { text: "OK", onPress: () => router.back() },
    ]);
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
            Cadastre uma vacina para o pet.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Nome da Vacina
            </Text>
            <MyTextInput
              name="nome"
              control={control}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Ex: V8, Antirrábica, Gripe"
            />
          </View>

          {/* Data de Aplicação */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Data de Aplicação
            </Text>
            <TouchableOpacity
              onPress={() => setShowDateAplicacao(true)}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-on-surface font-medium">
                {dateAplicacao.toLocaleDateString("pt-BR")}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showDateAplicacao && (
              <DateTimePicker
                value={dateAplicacao}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDateAplicacao(false);
                  if (selectedDate) {
                    setDateAplicacao(selectedDate);
                    setValue("dataAplicacao", selectedDate.toLocaleDateString("pt-BR"));
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
              onPress={() => setShowDateProxima(true)}
              className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-on-surface font-medium">
                {dateProxima.toLocaleDateString("pt-BR")}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#02C39A" />
            </TouchableOpacity>
            {showDateProxima && (
              <DateTimePicker
                value={dateProxima}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDateProxima(false);
                  if (selectedDate) {
                    setDateProxima(selectedDate);
                    setValue("proximaDose", selectedDate.toLocaleDateString("pt-BR"));
                  }
                }}
              />
            )}
          </View>

          {/* Status */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="info-outline" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Status
              </Text>
            </View>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View className="gap-3">
                  {STATUS_VACINA.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => onChange(s)}
                      className={`p-3 rounded-xl border-2 ${
                        value === s
                          ? "bg-primary-container border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold font-headline ${
                          value === s
                            ? "text-on-primary-container"
                            : "text-on-surface"
                        }`}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {errors.status && (
                    <Text className="text-red-500 text-xs">
                      {errors.status.message}
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
            <MaterialIcons name="vaccines" size={24} color="white" />
            <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
              Cadastrar Vacina
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}