import { useAuth } from "@/context/AuthContext";
import { listarUnidades } from "@/services/unidade.service";
import { useQuery } from "@tanstack/react-query";

/** Unidades veterinárias cadastradas, pra escolher qual atende a consulta. */
export const unidadesQueryKey = ["unidades"] as const;

export function useUnidades() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: unidadesQueryKey,
    queryFn: () => listarUnidades(sessao!.token),
    enabled: sessao !== undefined,
  });
}
