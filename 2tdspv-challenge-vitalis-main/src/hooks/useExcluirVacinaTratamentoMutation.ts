import { useAuth } from "@/context/AuthContext";
import { excluirVacinaTratamento } from "@/services/vacinaTratamento.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vacinasTratamentosQueryKey } from "./useVacinasTratamentos";

export function useExcluirVacinaTratamentoMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => excluirVacinaTratamento(id, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacinasTratamentosQueryKey });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
