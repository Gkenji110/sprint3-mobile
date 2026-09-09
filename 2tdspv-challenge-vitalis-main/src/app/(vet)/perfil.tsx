import MyTextInput from "@/components/MyTextInput";
import { useEncerrarSessao } from "@/hooks/useSessao";
import { useVeterinarioPerfil } from "@/hooks/useVeterinarioPerfil";
import { useEditarVeterinarioMutation } from "@/hooks/useEditarVeterinarioMutation";
import { useExcluirVeterinarioMutation } from "@/hooks/useExcluirVeterinarioMutation";
import { VeterinarioPerfilInput, VeterinarioPerfilSchema } from "@/schemas/veterinarioPerfil.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FORM_VAZIO: VeterinarioPerfilInput = {
  nome: "",
  especialidade: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

export default function PerfilVeterinarioScreen() {
  const { data: perfil, isLoading } = useVeterinarioPerfil();
  const {
    mutate: editarPerfil,
    isPending: salvando,
    isError: erroAoSalvar,
    error: erroDoSalvar,
  } = useEditarVeterinarioMutation(perfil?.crmv ?? "");
  const {
    mutate: excluirPerfil,
    isPending: excluindo,
    isError: erroAoExcluir,
    error: erroDaExclusao,
  } = useExcluirVeterinarioMutation();
  const sair = useEncerrarSessao();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VeterinarioPerfilInput>({
    defaultValues: FORM_VAZIO,
    resolver: zodResolver(VeterinarioPerfilSchema),
  });

  const handleEditar = () => {
    if (!perfil) return;
    setValue("nome", perfil.nome);
    setValue("especialidade", perfil.especialidade ?? "");
    setValue("email", perfil.email);
  };

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Perfil",
      "Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirPerfil(),
        },
      ]
    );
  };

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

  // A exclusão encerra a sessão e volta pro login de dentro do próprio hook
  // (useExcluirVeterinarioMutation); aqui só limpamos o formulário quando o
  // salvar dá certo, que é específico desta tela.
  const handleSave = (data: VeterinarioPerfilInput) => {
    if (!perfil) return;
    Alert.alert(
      "Salvar Perfil",
      "Deseja salvar as alterações do seu perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: () =>
            editarPerfil(
              {
                nome: data.nome,
                especialidade: data.especialidade || undefined,
                email: data.email,
                telefone: perfil.telefone ?? undefined,
                senha: data.senha,
              },
              { onSuccess: () => reset(FORM_VAZIO) },
            ),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View className="my-4">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Perfil
          </Text>
          <Text className="text-on-surface-variant font-body mt-1">
            Informações do veterinário.
          </Text>
        </View>

        {/* Card com dados salvos */}
        {isLoading ? (
          <View className="bg-surface-container-low rounded-3xl p-10 mb-6 items-center">
            <ActivityIndicator size="large" color="#02C39A" />
          </View>
        ) : perfil ? (
          <View className="bg-secondary rounded-3xl p-6 mb-6 gap-2">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="person" size={24} color="#a8f0dc" />
                <Text className="text-primary-container font-headline font-bold uppercase tracking-wide text-sm">
                  Dados Salvos
                </Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleEditar}
                  className="bg-primary-container px-3 py-1 rounded-full"
                >
                  <Text className="text-on-primary-container font-headline font-bold text-xs uppercase">
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleExcluir}
                  disabled={excluindo}
                  className="bg-red-500/20 px-3 py-1 rounded-full"
                >
                  <Text className="text-red-400 font-headline font-bold text-xs uppercase">
                    {excluindo ? "..." : "Excluir"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-white font-bold font-headline text-lg">
              {perfil.nome}
            </Text>
            <Text className="text-white/70 font-body">{perfil.crmv}</Text>
            {perfil.especialidade && (
              <Text className="text-white/70 font-body">{perfil.especialidade}</Text>
            )}
            <Text className="text-white/70 font-body">{perfil.email}</Text>
            {erroAoExcluir && (
              <Text className="text-red-300 font-body text-sm">
                {erroDaExclusao.message}
              </Text>
            )}
          </View>
        ) : null}

        <View className="gap-6 pb-24">

          {/* Formulário */}
          <View className="bg-surface-container-low p-6 rounded-3xl gap-4">
            <View className="flex-row items-center gap-3 mb-2">
              <MaterialIcons name="edit" size={22} color="#02C39A" />
              <Text className="font-headline text-lg font-bold uppercase tracking-tight">
                Atualizar Dados
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Nome completo
              </Text>
              <MyTextInput
                name="nome"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Ex: Dra. Ana Souza"
              />
            </View>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Especialidade (opcional)
              </Text>
              <MyTextInput
                name="especialidade"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Ex: Clínica Geral"
              />
            </View>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Email
              </Text>
              <MyTextInput
                name="email"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Ex: ana@vetclinica.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Senha
              </Text>
              <Text className="text-on-surface-variant font-body text-xs ml-1 -mt-1">
                Obrigatória para salvar. Repita a senha atual para não mudá-la, ou digite uma nova para trocá-la.
              </Text>
              <MyTextInput
                name="senha"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Senha atual ou nova senha"
                secureTextEntry
              />
            </View>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Confirmar senha
              </Text>
              <MyTextInput
                name="confirmarSenha"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Repita a senha"
                secureTextEntry
              />
            </View>
          </View>

          {/* Estado da mutation de salvar */}
          {erroAoSalvar && (
            <Text className="text-red-500 text-center font-body -mt-2">
              {erroDoSalvar.message}
            </Text>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSubmit(handleSave)}
            disabled={salvando}
            style={{ opacity: salvando ? 0.6 : 1 }}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center flex-row gap-3"
          >
            {salvando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="save" size={24} color="white" />
                <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                  Salvar Perfil
                </Text>
              </>
            )}
          </TouchableOpacity>

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
      </ScrollView>
    </SafeAreaView>
  );
}
