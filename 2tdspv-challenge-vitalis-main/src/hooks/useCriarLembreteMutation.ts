import { useAuth } from "@/context/AuthContext";
import { criarLembrete, LembreteRequestBody } from "@/services/lembrete.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lembretesQueryKey } from "./useLembretes";
import { router } from "expo-router";

/** O que o formulário coleta — sem `responsavelId`, que vem da sessão. */
export type DadosDoFormularioDeLembrete = Omit<LembreteRequestBody, "responsavelId">;

export function useCriarLembreteMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: DadosDoFormularioDeLembrete) =>
      criarLembrete({ ...dados, responsavelId: sessao!.id }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lembretesQueryKey });
      router.back();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
