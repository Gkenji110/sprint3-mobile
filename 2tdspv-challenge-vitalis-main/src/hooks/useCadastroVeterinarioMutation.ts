import { registrarVeterinario } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useIniciarSessao } from "./useSessao";

/**
 * Liga o formulário de cadastro de veterinário ao backend.
 *
 * Mesma ideia de `useCadastroMutation`: o registro já devolve o token, então
 * o usuário entra direto — o `ControleDeAcesso` leva ao lado do veterinário
 * sozinho, olhando o `perfil` da sessão recém-criada.
 */
export function useCadastroVeterinarioMutation() {
  const iniciarSessao = useIniciarSessao();

  return useMutation({
    mutationFn: registrarVeterinario,
    onSuccess: iniciarSessao,
    onError: (error) => {
      console.error(error);
    },
  });
}
