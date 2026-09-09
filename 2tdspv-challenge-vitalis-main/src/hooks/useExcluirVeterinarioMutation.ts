import { useAuth } from "@/context/AuthContext";
import { excluirVeterinario } from "@/services/veterinario.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

export function useExcluirVeterinarioMutation() {
  const { sessao, sair } = useAuth();

  return useMutation({
    mutationFn: () => excluirVeterinario(sessao!.id, sessao!.token),
    onSuccess: async () => {
      await sair();
      router.replace("/");
    },
  });
}
