import { useAuth } from "@/context/AuthContext";
import { listarMeusLembretes } from "@/services/lembrete.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Lembretes do tutor logado, vindos da API (`GET /api/lembretes`).
 *
 * Só roda com sessão aberta — sem token não há o que pedir, e o backend
 * responderia 401 de qualquer forma.
 */
export const lembretesQueryKey = ["lembretes"] as const;

export function useLembretes() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: lembretesQueryKey,
    queryFn: () => listarMeusLembretes(sessao!.token),
    enabled: sessao !== undefined,
  });
}
