import { autenticar } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useIniciarSessao } from "./useSessao";

/**
 * Liga o formulário de login ao backend.
 *
 * A tela não navega no sucesso: assim que a sessão existe, o `ControleDeAcesso`
 * percebe o `perfil` devolvido e leva ao lado certo do app (tutor ou
 * veterinário) sozinho — é o controle de acesso governando a navegação, em
 * vez de cada tela decidir por conta própria para onde ir.
 */
export function useLoginMutation() {
  const iniciarSessao = useIniciarSessao();

  return useMutation({
    mutationFn: autenticar,
    onSuccess: iniciarSessao,
    onError: (error) => {
      console.error(error);
    },
  });
}
