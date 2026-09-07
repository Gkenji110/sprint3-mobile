import { usePet } from "@/context/PetContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SINTOMAS = [
  "Vômito",
  "Diarreia",
  "Perda de apetite",
  "Letargia",
  "Tosse",
  "Espirros",
  "Coceira",
  "Perda de pelo",
  "Sede excessiva",
  "Dificuldade para respirar",
];

const DURACOES = [
  "Menos de 1 dia",
  "1 a 3 dias",
  "3 a 7 dias",
  "Mais de 7 dias",
];

export default function SintomasScreen() {
  const { pets } = usePet();

  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [petSelecionado, setPetSelecionado] = useState("");

  const toggleSintoma = (sintoma: string) => {
    setSintomasSelecionados((prev) =>
      prev.includes(sintoma)
        ? prev.filter((s) => s !== sintoma)
        : [...prev, sintoma]
    );
  };

  const handleSubmit = () => {
    if (!petSelecionado) {
      Alert.alert("Atenção", "Selecione um pet.");
      return;
    }
    if (sintomasSelecionados.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um sintoma.");
      return;
    }
    if (!duracao) {
      Alert.alert("Atenção", "Selecione a duração dos sintomas.");
      return;
    }
    router.navigate({
      pathname: "/sugestao-ia",
      params: {
        pet: petSelecionado,
        sintomas: sintomasSelecionados.join(", "),
        duracao,
        descricao,
      },
    });
  }; 

  return ( 
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        <View className="my-8">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Relatar Sintomas
          </Text>
          <Text className="text-on-surface-variant font-body mt-2">
            Selecione os sintomas do seu pet.
          </Text>
        </View>

        <View className="gap-6 pb-24">

          
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="pets" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Pet
              </Text>
            </View>
            <View className="gap-3">
              {pets.length === 0 ? (
                <Text className="text-on-surface-variant font-body text-sm">
                  Nenhum pet cadastrado.
                </Text>
              ) : (
                pets.map((pet, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setPetSelecionado(pet.nome)}
                    className={`flex-row items-center gap-3 p-3 rounded-xl border-2 ${
                      petSelecionado === pet.nome
                        ? "bg-primary-container border-primary"
                        : "bg-surface-container-lowest border-transparent"
                    }`}
                  >
                    <Text className="text-xl">
                      {pet.especie === "Cachorro"
                        ? "🐶"
                        : pet.especie === "Gato"
                        ? "🐱"
                        : pet.especie === "Pássaro"
                        ? "🐦"
                        : "🐾"}
                    </Text>
                    <Text
                      className={`font-bold font-headline ${
                        petSelecionado === pet.nome
                          ? "text-on-primary-container"
                          : "text-on-surface"
                      }`}
                    >
                      {pet.nome}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="sick" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Sintomas
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {SINTOMAS.map((sintoma) => (
                <TouchableOpacity
                  key={sintoma}
                  onPress={() => toggleSintoma(sintoma)}
                  className={`px-4 py-2 rounded-full border-2 ${
                    sintomasSelecionados.includes(sintoma)
                      ? "bg-primary-container border-primary"
                      : "bg-surface-container-lowest border-transparent"
                  }`}
                >
                  <Text
                    className={`font-bold font-headline text-sm ${
                      sintomasSelecionados.includes(sintoma)
                        ? "text-on-primary-container"
                        : "text-on-surface"
                    }`}
                  >
                    {sintoma}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {sintomasSelecionados.length > 0 && (
              <View className="bg-surface-container-lowest p-3 rounded-xl mt-2">
                <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 font-headline">
                  Selecionados
                </Text>
                <Text className="text-on-surface font-body text-sm">
                  {sintomasSelecionados.join(", ")}
                </Text>
              </View>
            )}
          </View>

          
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="schedule" size={22} color="#02C39A" />
              <Text className="font-headline text-base font-bold uppercase tracking-tight">
                Duração
              </Text>
            </View>
            <View className="gap-3">
              {DURACOES.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setDuracao(d)}
                  className={`p-3 rounded-xl border-2 ${
                    duracao === d
                      ? "bg-primary-container border-primary"
                      : "bg-surface-container-lowest border-transparent"
                  }`}
                >
                  <Text
                    className={`font-bold font-headline ${
                      duracao === d
                        ? "text-on-primary-container"
                        : "text-on-surface"
                    }`}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
              Descrição adicional
            </Text>
            <TextInput
              className="w-full p-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
              placeholder="Descreva outros detalhes que observou..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          
          <TouchableOpacity
            onPress={handleSubmit}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            <MaterialIcons name="send" size={24} color="white" />
            <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
              Analisar Sintomas
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}