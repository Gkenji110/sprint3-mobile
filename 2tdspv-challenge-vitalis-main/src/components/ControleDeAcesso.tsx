import { useAuth } from "@/context/AuthContext";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * Decide quem pode estar em qual rota.
 *
 * Fica num lugar só, envolvendo toda a navegação, em vez de cada tela se
 * defender sozinha: assim as telas soltas fora das abas — `edit-lembrete`,
 * `teleconsulta` — ficam protegidas sem precisar lembrar de cada uma, e as
 * telas futuras já nascem protegidas.
 */

/** Único conjunto de rotas alcançável sem sessão. */
const ROTAS_PUBLICAS = ["index", "login", "cadastro"];

export default function ControleDeAcesso({ children }: PropsWithChildren) {
  const { autenticado, carregando } = useAuth();
  const segmentos = useSegments();
  const router = useRouter();
  const navegacao = useRootNavigationState();

  // Na raiz não há segmento algum, e a raiz é o onboarding.
  const rotaAtual = (segmentos[0] as string | undefined) ?? "index";
  const rotaEhPublica = ROTAS_PUBLICAS.includes(rotaAtual);
  const navegacaoPronta = navegacao?.key !== undefined;

  useEffect(() => {
    // Redirecionar antes de saber se existe sessão salva expulsaria, a cada
    // abertura do app, um usuário que está legitimamente logado. E o roteador
    // só aceita navegação depois que a raiz terminou de montar.
    if (carregando || !navegacaoPronta) {
      return;
    }
    if (!autenticado && !rotaEhPublica) {
      router.replace("/login");
    } else if (autenticado && rotaEhPublica) {
      router.replace("/dashboard");
    }
  }, [autenticado, carregando, navegacaoPronta, rotaEhPublica, router]);

  if (carregando) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "#1E2D40" }}
      >
        <ActivityIndicator size={64} color="#02C39A" />
      </View>
    );
  }

  return <>{children}</>;
}
