import { useAuth } from "@/context/AuthContext";
import { excluirResponsavel } from "@/services/responsavel.service";
import { useMutation } from "@tanstack/react-query";

export function useExcluirResponsavelMutation() {
  const { sessao } = useAuth();

  return useMutation({
    mutationFn: () => excluirResponsavel(sessao!.id, sessao!.token),
  });
}
