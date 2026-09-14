import { useAuth } from "@/context/AuthContext";
import { buscarResponsavelPorId } from "@/services/responsavel.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Dados do tutor logado, vindos da API (`GET /api/responsaveis/{id}`).
 *
 * Só roda com sessão aberta — sem token/id não há o que pedir.
 */
export const responsavelQueryKey = ["responsavel"] as const;

export function useResponsavelPerfil() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: [...responsavelQueryKey, sessao?.id],
    queryFn: () => buscarResponsavelPorId(sessao!.id, sessao!.token),
    enabled: sessao !== undefined,
  });
}
