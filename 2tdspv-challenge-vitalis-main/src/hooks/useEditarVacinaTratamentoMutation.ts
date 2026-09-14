import { useAuth } from "@/context/AuthContext";
import { VacinaTratamentoEditarInput } from "@/schemas/vacinaTratamentoVeterinario.schema";
import { atualizarVacinaTratamento } from "@/services/vacinaTratamento.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vacinasTratamentosQueryKey } from "./useVacinasTratamentos";
import { router } from "expo-router";

/**
 * `petId` é pedido aqui porque o `PUT /api/vacinas-tratamentos/{id}` exige o
 * campo (ver comentário em `vacinaTratamento.service.ts`), mas o update do
 * backend o ignora — quem chama busca o valor na própria lista de pacientes
 * do veterinário, já que a resposta não devolve nenhum ID.
 */
export function useEditarVacinaTratamentoMutation(id: number, petId: number) {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: VacinaTratamentoEditarInput) =>
      atualizarVacinaTratamento(
        id,
        { ...dados, petId, veterinarioId: sessao!.id },
        sessao!.token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacinasTratamentosQueryKey });
      router.back();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
