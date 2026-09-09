import { useAuth } from "@/context/AuthContext";
import { VacinaTratamentoRegistrarInput } from "@/schemas/vacinaTratamentoVeterinario.schema";
import { registrarVacinaTratamento } from "@/services/vacinaTratamento.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export function useRegistrarVacinaTratamentoMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: VacinaTratamentoRegistrarInput) =>
      registrarVacinaTratamento({ ...dados, veterinarioId: sessao!.id }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacinas-tratamentos"] });
      router.back();
    },
  });
}
