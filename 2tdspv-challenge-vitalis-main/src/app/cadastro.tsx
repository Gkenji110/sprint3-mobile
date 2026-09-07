import MyTextInput from "@/components/MyTextInput";
import { useCadastro } from "@/hooks/useCadastro";
import { CadastroInput, CadastroSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CadastroScreen() {
  const { mutate: cadastrar, isPending } = useCadastro();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroInput>({
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
    resolver: zodResolver(CadastroSchema),
  });

  // O cadastro já autentica, então não há confirmação nem volta para o login:
  // o ControleDeAcesso leva ao dashboard assim que a sessão existe.
  const handleCadastro = (data: CadastroInput) => {
    cadastrar(data, {
      onError: (erro) => Alert.alert("Não foi possível criar a conta", erro.message),
    });
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "#1E2D40" }}
    >
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-10 items-center gap-3">
          <Text className="text-5xl">🐾</Text>
          <Text className="text-4xl font-black tracking-tighter text-white uppercase font-headline">
            PetHub
          </Text>
          <Text className="text-white/60 font-body text-center">
            Crie sua conta para começar
          </Text>
        </View>

        <View className="gap-5 pb-24">

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1 font-headline">
              Nome completo
            </Text>
            <MyTextInput
              name="nome"
              control={control}
              className="w-full h-14 px-5 rounded-xl text-white font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              placeholder="Ex: João Silva"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
          </View>

          {/* CPF */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1 font-headline">
              CPF
            </Text>
            <MyTextInput
              name="cpf"
              control={control}
              className="w-full h-14 px-5 rounded-xl text-white font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              placeholder="Somente números"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="number-pad"
              maxLength={11}
            />
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1 font-headline">
              Email
            </Text>
            <MyTextInput
              name="email"
              control={control}
              className="w-full h-14 px-5 rounded-xl text-white font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              placeholder="Ex: joao@email.com"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Senha */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1 font-headline">
              Senha
            </Text>
            <MyTextInput
              name="senha"
              control={control}
              className="w-full h-14 px-5 rounded-xl text-white font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
            />
          </View>

          {/* Confirmar Senha */}
          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1 font-headline">
              Confirmar Senha
            </Text>
            <MyTextInput
              name="confirmarSenha"
              control={control}
              className="w-full h-14 px-5 rounded-xl text-white font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              placeholder="Repita sua senha"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity
            onPress={handleSubmit(handleCadastro)}
            disabled={isPending}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center mt-2"
            style={{ opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                Criar Conta
              </Text>
            )}
          </TouchableOpacity>

          {/* Link para Login */}
          <TouchableOpacity
            onPress={() => router.replace("/login")}
            className="items-center"
          >
            <Text className="text-white/60 font-body">
              Já tem uma conta?{" "}
              <Text className="text-primary font-bold">Entrar</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}