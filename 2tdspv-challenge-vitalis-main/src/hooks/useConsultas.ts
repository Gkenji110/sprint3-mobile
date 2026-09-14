import { useAuth } from "@/context/AuthContext";
import { listarMinhasConsultas } from "@/services/consulta.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Consultas do tutor logado, vindas da API (`GET /api/consultas`).
 *
 * Só roda com sessão aberta — sem token não há o que pedir, e o backend
 * responderia 401 de qualquer forma.
 */
export const consultasQueryKey = ["consultas"] as const;

export function useConsultas() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: consultasQueryKey,
    queryFn: () => listarMinhasConsultas(sessao!.token),
    enabled: sessao !== undefined,
  });
}
