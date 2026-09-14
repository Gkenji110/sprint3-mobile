import { useAuth } from "@/context/AuthContext";
import { atualizarLembrete } from "@/services/lembrete.service";
import { DadosDoFormularioDeLembrete } from "./useCriarLembreteMutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lembretesQueryKey } from "./useLembretes";
import { router } from "expo-router";

export function useEditarLembreteMutation(id: number) {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: DadosDoFormularioDeLembrete) =>
      atualizarLembrete(id, { ...dados, responsavelId: sessao!.id }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lembretesQueryKey });
      router.back();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
