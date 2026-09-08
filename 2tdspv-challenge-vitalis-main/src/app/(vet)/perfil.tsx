import { useAuth } from "@/context/AuthContext";
import { useEncerrarSessao } from "@/hooks/useSessao";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Perfil do veterinário, versão mínima: só identificação e logout.
 *
 * Editar os próprios dados (`PUT /api/veterinarios/{id}`) fica para uma
 * próxima etapa, seguindo o mesmo caminho que o Perfil do tutor percorreu
 * (leitura primeiro, CRUD depois) — não faz sentido construir os dois de uma
 * vez.
 */
export default function PerfilVeterinarioScreen() {
  const { sessao } = useAuth();
  const sair = useEncerrarSessao();

  const handleSair = () => {
    Alert.alert(
      "Sair",
      "Deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await sair();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-6 pt-4 gap-6">

        {/* Header */}
        <View>
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Perfil
          </Text>
          <Text className="text-on-surface-variant font-body mt-1">
            {sessao?.nome}
          </Text>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          onPress={handleSair}
          className="w-full bg-surface-container-low h-14 rounded-2xl items-center justify-center flex-row gap-3"
        >
          <MaterialIcons name="logout" size={22} color="#ef4444" />
          <Text className="text-red-500 font-headline font-bold text-base uppercase tracking-widest">
            Sair
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
