import { useAuth } from "@/context/AuthContext";
import { buscarVeterinarioPorId } from "@/services/veterinario.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Dados do veterinário logado, vindos da API (`GET /api/veterinarios/{id}`).
 *
 * Só roda com sessão aberta — sem token/id não há o que pedir.
 */
export function useVeterinarioPerfil() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: ["veterinario", sessao?.id],
    queryFn: () => buscarVeterinarioPorId(sessao!.id, sessao!.token),
    enabled: sessao !== undefined,
  });
}
