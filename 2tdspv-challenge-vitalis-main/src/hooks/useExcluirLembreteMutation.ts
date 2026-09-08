import { useAuth } from "@/context/AuthContext";
import { excluirLembrete } from "@/services/lembrete.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExcluirLembreteMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => excluirLembrete(id, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lembretes"] });
    },
  });
}
