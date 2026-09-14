import { useAuth } from "@/context/AuthContext";
import { atualizarVeterinario, VeterinarioRequestBody } from "@/services/veterinario.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** Dados que o formulário de Perfil coleta — `crmv`/`ativo` o hook completa sozinho. */
export type DadosDoFormularioDeVeterinario = Omit<VeterinarioRequestBody, "crmv" | "ativo">;

export function useEditarVeterinarioMutation(crmv: string) {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: DadosDoFormularioDeVeterinario) =>
      atualizarVeterinario(sessao!.id, { ...dados, crmv, ativo: true }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veterinario"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
