import MyTextInput from "@/components/MyTextInput";
import { useLoginMutation } from "@/hooks/useLoginMutation";
import { LoginInput, LoginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { mutate: autenticar, isPending, isError, error } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      senha: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  // Não há navegação no sucesso: assim que a sessão existe, o ControleDeAcesso
  // leva ao dashboard sozinho. O estado da mutation controla o feedback.
  const handleLogin = (data: LoginInput) => {
    autenticar(data);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#1E2D40" }}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="my-10 items-center gap-3">
          <Text className="text-5xl">🐾</Text>
          <Text className="text-4xl font-black tracking-tighter text-white uppercase font-headline">
            PetHub
          </Text>
          <Text className="text-white/60 font-body text-center">
            Entre na sua conta
          </Text>
        </View>

        <View className="gap-5 pb-24">

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
              placeholder="Sua senha"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
            />
          </View>

          {/* Erro da mutation */}
          {isError && (
            <Text className="text-red-400 text-center font-body">
              {error.message}
            </Text>
          )}

          {/* Botão Login */}
          <TouchableOpacity
            onPress={handleSubmit(handleLogin)}
            disabled={isPending}
            className="w-full bg-primary h-16 rounded-2xl items-center justify-center mt-2"
            style={{ opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-headline font-black text-lg uppercase tracking-widest">
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          {/* Link para Cadastro */}
          <TouchableOpacity
            onPress={() => router.replace("/cadastro")}
            className="items-center"
          >
            <Text className="text-white/60 font-body">
              Não tem uma conta?{" "}
              <Text className="text-primary font-bold">Cadastre-se</Text>
            </Text>
          </TouchableOpacity>

          {/* Link para Cadastro de Veterinário */}
          <TouchableOpacity
            onPress={() => router.replace("/cadastro-veterinario")}
            className="items-center"
          >
            <Text className="text-white/60 font-body">
              É veterinário?{" "}
              <Text className="text-primary font-bold">Cadastre-se aqui</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
