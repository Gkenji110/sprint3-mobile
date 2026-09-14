import { useAuth } from "@/context/AuthContext";
import { listarMeusPets } from "@/services/pet.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Pets do tutor logado, vindos da API (`GET /api/pets`).
 *
 * Só roda com sessão aberta — sem token não há o que pedir, e o backend
 * responderia 401 de qualquer forma.
 */
export const petsQueryKey = ["pets"] as const;

export function usePets() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: petsQueryKey,
    queryFn: () => listarMeusPets(sessao!.token),
    enabled: sessao !== undefined,
  });
}
