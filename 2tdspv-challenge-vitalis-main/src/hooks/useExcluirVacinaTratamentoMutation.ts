import { useAuth } from "@/context/AuthContext";
import { excluirVacinaTratamento } from "@/services/vacinaTratamento.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExcluirVacinaTratamentoMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => excluirVacinaTratamento(id, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacinas-tratamentos"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
