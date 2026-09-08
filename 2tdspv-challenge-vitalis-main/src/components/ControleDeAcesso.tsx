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
 * telas futuras já nascem protegidas. O mesmo raciocínio vale para o perfil:
 * tutor e veterinário têm grupos de abas diferentes, e é aqui que se decide
 * qual deles a sessão atual pode ver.
 */

/** Único conjunto de rotas alcançável sem sessão. */
const ROTAS_PUBLICAS = ["index", "login", "cadastro", "cadastro-veterinario"];

/**
 * Raiz de cada lado do app, por perfil — para onde mandar depois do login.
 *
 * Os grupos `(tabs)` e `(vet)` só existem no sistema de arquivos: os
 * parênteses não entram na URL, então o href de navegação é o nome da tela
 * sem o grupo (`/pacientes`, não `/(vet)/pacientes`).
 */
function rotaInicialDoPerfil(perfil: "RESPONSAVEL" | "VETERINARIO"): "/dashboard" | "/pacientes" {
  return perfil === "VETERINARIO" ? "/pacientes" : "/dashboard";
}

export default function ControleDeAcesso({ children }: PropsWithChildren) {
  const { autenticado, carregando, sessao } = useAuth();
  const segmentos = useSegments();
  const router = useRouter();
  const navegacao = useRootNavigationState();

  // Na raiz não há segmento algum, e a raiz é o onboarding.
  const rotaAtual = (segmentos[0] as string | undefined) ?? "index";
  const rotaEhPublica = ROTAS_PUBLICAS.includes(rotaAtual);
  // Só as raízes de abas são exclusivas de um perfil. Telas soltas fora delas
  // (add-lembrete, add-pet-vet, pet-details...) são cada uma usada só por um
  // lado na prática, mas não têm como o guarda saber disso pelo nome da rota
  // — então elas passam livres daqui, e cada uma se vira com o que a API
  // permitir (ex.: o backend já barra um tutor que tentasse chamar a rota de
  // pets do veterinário).
  const rotaEhAreaDoTutor = rotaAtual === "(tabs)";
  const rotaEhAreaDoVeterinario = rotaAtual === "(vet)";
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
      return;
    }
    if (autenticado && rotaEhPublica) {
      router.replace(rotaInicialDoPerfil(sessao!.perfil));
      return;
    }
    // Sessão existe, mas está tentando abrir a raiz de abas do outro perfil
    // (ex.: tutor tentando abrir (vet), ou vice-versa).
    const naAreaErradaDoTutor = rotaEhAreaDoTutor && sessao!.perfil === "VETERINARIO";
    const naAreaErradaDoVeterinario = rotaEhAreaDoVeterinario && sessao!.perfil === "RESPONSAVEL";
    if (autenticado && (naAreaErradaDoTutor || naAreaErradaDoVeterinario)) {
      router.replace(rotaInicialDoPerfil(sessao!.perfil));
    }
  }, [autenticado, carregando, navegacaoPronta, rotaEhAreaDoTutor, rotaEhAreaDoVeterinario, rotaEhPublica, router, sessao]);

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
