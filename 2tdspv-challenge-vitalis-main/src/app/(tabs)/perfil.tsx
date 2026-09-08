import MyTextInput from "@/components/MyTextInput";
import { useEncerrarSessao } from "@/hooks/useSessao";
import { useResponsavelPerfil } from "@/hooks/useResponsavelPerfil";
import { useEditarResponsavelMutation } from "@/hooks/useEditarResponsavelMutation";
import { useExcluirResponsavelMutation } from "@/hooks/useExcluirResponsavelMutation";
import { ResponsavelInput, ResponsavelSchema } from "@/schemas/responsavel.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FORM_VAZIO: ResponsavelInput = { nome: "", email: "", senha: "", confirmarSenha: "" };

export default function PerfilScreen() {
  const { data: perfil, isLoading } = useResponsavelPerfil();
  const { mutate: editarPerfil, isPending: salvando } = useEditarResponsavelMutation();
  const { mutate: excluirPerfil, isPending: excluindo } = useExcluirResponsavelMutation();
  const sair = useEncerrarSessao();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ResponsavelInput>({
    defaultValues: FORM_VAZIO,
    resolver: zodResolver(ResponsavelSchema),
  });

  const handleEditar = () => {
    if (!perfil) return;
    setValue("nome", perfil.nome);
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
          onPress: () => {
            excluirPerfil(undefined, {
              onSuccess: async () => {
                await sair();
                router.replace("/");
              },
              onError: (erro) => Alert.alert("Não foi possível excluir", erro.message),
            });
          },
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

  const handleSave = (data: ResponsavelInput) => {
    if (!perfil) return;
    editarPerfil(
      { nome: data.nome, email: data.email, senha: data.senha, cpf: perfil.cpf },
      {
        onSuccess: () => {
          reset(FORM_VAZIO);
          Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        },
        onError: (erro) => Alert.alert("Não foi possível salvar", erro.message),
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView 
        className="px-6" 
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View className="mb-4">
          <Text className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface uppercase">
            Perfil
          </Text>
          <Text className="text-on-surface-variant font-body mt-1">
            Informações do responsável pelo pet.
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
            <Text className="text-white/70 font-body">{perfil.email}</Text>
          </View>
        ) : null}

        {/* Atalho para cadastrar pet */}
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/pets")}
          className="bg-surface-container-low rounded-2xl p-5 flex-row items-center justify-between mb-6"
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-primary-container w-10 h-10 rounded-full items-center justify-center">
              <MaterialIcons name="pets" size={20} color="#00382a" />
            </View>
            <View>
              <Text className="text-on-surface font-bold font-headline">
                Meus Pets
              </Text>
              <Text className="text-on-surface-variant font-body text-sm">
                Cadastrar ou gerenciar pets
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#404943" />
        </TouchableOpacity>

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
                placeholder="Ex: João Silva"
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
                placeholder="Ex: joao@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-headline">
                Senha
              </Text>
              <Text className="text-on-surface-variant font-body text-xs ml-1 -mt-1">
                Confirme sua senha para salvar as alterações.
              </Text>
              <MyTextInput
                name="senha"
                control={control}
                className="w-full h-14 px-5 bg-surface-container-lowest rounded-xl text-on-surface font-medium"
                placeholder="Sua senha atual"
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
