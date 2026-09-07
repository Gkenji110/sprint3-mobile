import { useConsulta } from "@/context/ConsultaContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeleconsultaScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const { consultas } = useConsulta();

  const consulta = index ? consultas[parseInt(index)] : undefined;

  const [emChamada, setEmChamada] = useState(false);
  const [micAtivo, setMicAtivo] = useState(true);
  const [cameraAtiva, setCameraAtiva] = useState(true);

  const handleIniciar = () => {
    setEmChamada(true);
  };

  const handleEncerrar = () => {
    setEmChamada(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Teleconsulta
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            {consulta
              ? `Consulta com ${consulta.veterinario}`
              : "Consulta online com veterinário"}
          </Text>
        </View>

        <View className="gap-6 pb-24">

          {/* Tela da Chamada */}
          <View className="bg-secondary rounded-3xl overflow-hidden" style={{ height: 320 }}>
            {emChamada ? (
              <View className="flex-1 items-center justify-center gap-4">
                <View className="w-24 h-24 rounded-full bg-primary-container items-center justify-center">
                  <MaterialIcons name="person" size={48} color="#00382a" />
                </View>
                <Text className="text-white font-headline text-xl font-bold">
                  {consulta?.veterinario ?? "Veterinário"}
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-primary" />
                  <Text className="text-primary font-body text-sm">
                    Em chamada...
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center gap-4">
                <MaterialIcons name="videocam-off" size={64} color="rgba(255,255,255,0.3)" />
                <Text className="text-white/50 font-body text-center px-8">
                  Clique em iniciar para começar a teleconsulta
                </Text>
              </View>
            )}
          </View>

          {/* Informações da Consulta */}
          {consulta && (
            <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="info-outline" size={22} color="#02C39A" />
                <Text className="font-headline text-base font-bold uppercase tracking-tight">
                  Informações
                </Text>
              </View>
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="person" size={18} color="#404943" />
                  <Text className="text-on-surface font-body">
                    {consulta.veterinario}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="local-hospital" size={18} color="#404943" />
                  <Text className="text-on-surface font-body">
                    {consulta.clinica}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="pets" size={18} color="#404943" />
                  <Text className="text-on-surface font-body">
                    {consulta.pet}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="calendar-today" size={18} color="#404943" />
                  <Text className="text-on-surface font-body">
                    {consulta.data} às {consulta.hora}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Controles da Chamada */}
          {emChamada ? (
            <View className="gap-4">
              <View className="flex-row gap-4 justify-center">
                <TouchableOpacity
                  onPress={() => setMicAtivo(!micAtivo)}
                  className={`w-16 h-16 rounded-full items-center justify-center ${
                    micAtivo ? "bg-surface-container-low" : "bg-red-500"
                  }`}
                >
                  <MaterialIcons
                    name={micAtivo ? "mic" : "mic-off"}
                    size={28}
                    color={micAtivo ? "#1a1c1a" : "white"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCameraAtiva(!cameraAtiva)}
                  className={`w-16 h-16 rounded-full items-center justify-center ${
                    cameraAtiva ? "bg-surface-container-low" : "bg-red-500"
                  }`}
                >
                  <MaterialIcons
                    name={cameraAtiva ? "videocam" : "videocam-off"}
                    size={28}
                    color={cameraAtiva ? "#1a1c1a" : "white"}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleEncerrar}
                className="w-full bg-red-500 h-16 rounded-2xl items-center justify-center flex-row gap-3"
              >
                <MaterialIcons name="call-end" size={24} color="white" />
                <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                  Encerrar Chamada
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleIniciar}
              className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
            >
              <MaterialIcons name="videocam" size={24} color="white" />
              <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                Iniciar Teleconsulta
              </Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}