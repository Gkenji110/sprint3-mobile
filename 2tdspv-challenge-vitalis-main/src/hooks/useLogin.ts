import { autenticarComoTutor } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useIniciarSessao } from "./useSessao";

/**
 * Liga o formulário de login ao backend.
 *
 * A tela não navega no sucesso: assim que a sessão existe, o `ControleDeAcesso`
 * percebe e leva ao dashboard. É o controle de acesso governando a navegação,
 * em vez de cada tela decidir por conta própria para onde ir.
 */
export function useLogin() {
  const iniciarSessao = useIniciarSessao();

  return useMutation({
    mutationFn: autenticarComoTutor,
    onSuccess: iniciarSessao,
  });
}
