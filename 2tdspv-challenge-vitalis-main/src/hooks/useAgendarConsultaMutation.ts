import { useAuth } from "@/context/AuthContext";
import { ConsultaAgendarInput } from "@/schemas/consultaVeterinario.schema";
import { agendarConsulta } from "@/services/consulta.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { consultasQueryKey } from "./useConsultas";
import { router } from "expo-router";

/** Toda consulta nova nasce com status AGENDADA — não existe outro jeito de criar uma. */
export function useAgendarConsultaMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: ConsultaAgendarInput) =>
      agendarConsulta(
        { ...dados, veterinarioId: sessao!.id, status: "AGENDADA" },
        sessao!.token,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultasQueryKey });
      router.back();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
