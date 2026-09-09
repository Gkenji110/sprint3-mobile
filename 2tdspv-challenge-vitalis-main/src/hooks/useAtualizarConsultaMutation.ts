import { useAuth } from "@/context/AuthContext";
import { ConsultaEditarInput } from "@/schemas/consultaVeterinario.schema";
import { atualizarConsulta } from "@/services/consulta.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * `petId`/`unidadeId` são pedidos aqui porque o `PUT /api/consultas/{id}`
 * exige os dois (ver comentário em `consulta.service.ts`) — `unidadeId` de
 * verdade, `petId` só pela validação. Quem chama busca os dois na própria
 * lista de pacientes/unidades do veterinário, já que a resposta da consulta
 * não devolve IDs.
 */
export function useAtualizarConsultaMutation(id: number, petId: number, unidadeId: number) {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: ConsultaEditarInput) =>
      atualizarConsulta(
        id,
        { ...dados, petId, unidadeId, veterinarioId: sessao!.id },
        sessao!.token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
    },
  });
}
