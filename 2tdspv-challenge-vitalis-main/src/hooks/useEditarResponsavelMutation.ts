import { useAuth } from "@/context/AuthContext";
import { atualizarResponsavel, ResponsavelRequestBody } from "@/services/responsavel.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** Dados que o formulário de Perfil coleta — `ativo` o hook sempre manda como `true`. */
export type DadosDoFormularioDeResponsavel = Omit<ResponsavelRequestBody, "ativo">;

export function useEditarResponsavelMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: DadosDoFormularioDeResponsavel) =>
      atualizarResponsavel(sessao!.id, { ...dados, ativo: true }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responsavel"] });
    },
  });
}
