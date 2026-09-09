import { usePets } from "@/hooks/usePets";
import { useVacinasTratamentos } from "@/hooks/useVacinasTratamentos";
import VacinaTratamentoCard from "@/components/VacinaTratamentoCard";
import { iconeDaEspecie } from "@/utils/petIcon";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * `index` é a posição do pet na lista do tutor (mesma convenção já usada
 * pelas outras telas que navegam pra cá). Vacinas/tratamentos vêm da API de
 * verdade (`GET /api/vacinas-tratamentos?petId=...`) — `SecurityConfig`
 * coloca essa rota entre as clínicas, onde o tutor só lê: quem registra é
 * sempre o veterinário.
 */
export default function PetDetailsScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const { data: pets = [], isLoading } = usePets();

  const petIndex = parseInt(index);
  const pet = pets[petIndex];

  const { data: vacinas = [], isLoading: carregandoVacinas } = useVacinasTratamentos(pet?.id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#02C39A" />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center gap-4">
        <Text className="text-4xl">🐾</Text>
        <Text className="font-headline text-xl font-bold text-on-surface">
          Nenhum pet encontrado
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary font-body font-semibold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

        {/* Card Principal */}
        <View className="bg-secondary rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="bg-primary-container w-16 h-16 rounded-full items-center justify-center">
              <Text className="text-3xl">{iconeDaEspecie(pet.especie)}</Text>
            </View>
            <View>
              <Text className="text-white text-2xl font-bold font-headline">
                {pet.nome}
              </Text>
              <Text className="text-primary-container font-body">
                {pet.especie}{pet.raca ? ` · ${pet.raca}` : ""}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4 pt-4 border-t border-white/10">
            <View>
              <Text className="text-white/60 text-xs uppercase font-bold tracking-widest">
                Peso
              </Text>
              <Text className="text-white font-semibold">{pet.peso ?? "—"} kg</Text>
            </View>
            <View className="w-px bg-white/10" />
            <View>
              <Text className="text-white/60 text-xs uppercase font-bold tracking-widest">
                Sexo
              </Text>
              <Text className="text-white font-semibold">{pet.genero ?? "—"}</Text>
            </View>
          </View>
        </View>

        {/* Vacinas e tratamentos */}
        <View className="mb-4">
          <Text className="font-headline text-lg font-bold uppercase text-on-surface">
            Vacinas e Tratamentos
          </Text>
          <Text className="text-on-surface-variant font-body text-sm">
            Registrados pelo veterinário responsável.
          </Text>
        </View>

        {carregandoVacinas ? (
          <ActivityIndicator color="#02C39A" />
        ) : vacinas.length === 0 ? (
          <View className="bg-surface-container-low rounded-2xl p-6 items-center gap-3 mb-6">
            <Text className="text-3xl">💉</Text>
            <Text className="text-on-surface font-bold font-headline">
              Nenhuma vacina cadastrada
            </Text>
            <Text className="text-on-surface-variant font-body text-sm text-center">
              O veterinário registra vacinas e tratamentos durante o atendimento.
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-6">
            {vacinas.map((item) => (
              <VacinaTratamentoCard key={item.id} item={item} />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
