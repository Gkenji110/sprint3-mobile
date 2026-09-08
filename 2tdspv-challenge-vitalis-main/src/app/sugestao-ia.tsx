import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Urgencia = "urgente" | "consulta" | "observacao";

function getUrgencia(sintomas: string, duracao: string): Urgencia {
  const sintomasGraves = [
    "Dificuldade para respirar",
    "Vômito",
    "Diarreia",
  ];

  const temSintomaGrave = sintomasGraves.some((s) => sintomas.includes(s));
  const duracaoLonga = duracao === "Mais de 7 dias" || duracao === "3 a 7 dias";

  if (temSintomaGrave && duracaoLonga) return "urgente";
  if (temSintomaGrave || duracaoLonga) return "consulta";
  return "observacao";
}

const URGENCIA_CONFIG = {
  urgente: {
    emoji: "🚨",
    titulo: "Atendimento Urgente",
    descricao:
      "Os sintomas relatados indicam necessidade de atendimento imediato. Leve seu pet ao veterinário o quanto antes.",
    cor: "bg-red-100",
    corTexto: "text-red-700",
    corBotao: "bg-red-500",
  },
  consulta: {
    emoji: "🩺",
    titulo: "Consulta Recomendada",
    descricao:
      "Os sintomas relatados merecem atenção. Agende uma consulta veterinária em breve.",
    cor: "bg-yellow-100",
    corTexto: "text-yellow-700",
    corBotao: "bg-primary",
  },
  observacao: {
    emoji: "👀",
    titulo: "Observação em Casa",
    descricao:
      "Os sintomas relatados não indicam urgência. Observe seu pet e agende uma consulta se piorar.",
    cor: "bg-primary-container",
    corTexto: "text-on-primary-container",
    corBotao: "bg-primary",
  },
};

export default function SugestaoIaScreen() {
  const { pet, sintomas, duracao, descricao } = useLocalSearchParams<{
    pet: string;
    sintomas: string;
    duracao: string;
    descricao: string;
  }>();

  const urgencia = getUrgencia(sintomas, duracao);
  const config = URGENCIA_CONFIG[urgencia];

  /**
   * Agendar consulta de verdade é ação do veterinário/clínica na API (ver
   * `pet.service.ts`/`consulta.service.ts` — `SecurityConfig` restringe
   * escrita em `/api/consultas` a VETERINARIO). O tutor só é direcionado para
   * o histórico real; nada é criado localmente aqui.
   */
  const handleVerConsultas = () => {
    router.navigate("/(tabs)/consultas");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Análise IA
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Resultado da triagem para {pet}.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Card de Urgência */}
          <View className={`${config.cor} rounded-3xl p-6 gap-4`}>
            <Text className="text-5xl text-center">{config.emoji}</Text>
            <Text className={`font-headline text-2xl font-black text-center uppercase ${config.corTexto}`}>
              {config.titulo}
            </Text>
            <Text className={`font-body text-center ${config.corTexto}`}>
              {config.descricao}
            </Text>
          </View>

          {/* Resumo dos Sintomas */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="summarize" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Resumo
              </Text>
            </View>

            <View className="gap-3">
              <View className="gap-1">
                <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-headline">
                  Pet
                </Text>
                <Text className="text-on-surface font-body">{pet}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-headline">
                  Sintomas
                </Text>
                <Text className="text-on-surface font-body">{sintomas}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-headline">
                  Duração
                </Text>
                <Text className="text-on-surface font-body">{duracao}</Text>
              </View>

              {descricao ? (
                <View className="gap-1">
                  <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-headline">
                    Descrição
                  </Text>
                  <Text className="text-on-surface font-body">{descricao}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Botões */}
          <TouchableOpacity
            onPress={handleVerConsultas}
            className={`w-full ${config.corBotao} h-16 rounded-2xl items-center justify-center flex-row gap-3`}
          >
            <MaterialIcons name="medical-services" size={24} color="white" />
            <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
              Ver Minhas Consultas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full bg-surface-container-low h-14 rounded-2xl items-center justify-center"
          >
            <Text className="text-on-surface font-headline font-bold uppercase tracking-widest">
              Voltar
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}