import { registrarTutor } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useIniciarSessao } from "./useSessao";

/**
 * Liga o formulário de cadastro ao backend.
 *
 * Como o registro já devolve o token, o usuário entra direto: não há tela de
 * login intermediária, e o `ControleDeAcesso` leva ao dashboard sozinho.
 */
export function useCadastroMutation() {
  const iniciarSessao = useIniciarSessao();

  return useMutation({
    mutationFn: registrarTutor,
    onSuccess: iniciarSessao,
    onError: (error) => {
      console.error(error);
    },
  });
}
