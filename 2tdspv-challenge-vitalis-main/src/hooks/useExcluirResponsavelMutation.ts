import { useAuth } from "@/context/AuthContext";
import { excluirResponsavel } from "@/services/responsavel.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export function useExcluirResponsavelMutation() {
  const { sessao, sair } = useAuth();

  return useMutation({
    mutationFn: () => excluirResponsavel(sessao!.id, sessao!.token),
    onSuccess: async () => {
      await sair();
      router.replace("/");
    },
  });
}
