import { useAuth } from "@/context/AuthContext";
import { listarVacinasTratamentos } from "@/services/vacinaTratamento.service";
import { useQuery } from "@tanstack/react-query";

/**
 * Vacinas/tratamentos vindos da API (`GET /api/vacinas-tratamentos`).
 *
 * Sem `petId`, traz tudo que o escopo de quem pediu permite (veterinário vê
 * todas, tutor só as dos pets dele); com `petId`, filtra pra um único pet —
 * usado na tela de detalhes do pet do tutor.
 */
export const vacinasTratamentosQueryKey = ["vacinas-tratamentos"] as const;

export function useVacinasTratamentos(petId?: number) {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: [...vacinasTratamentosQueryKey, petId ?? "todas"],
    queryFn: () => listarVacinasTratamentos(sessao!.token, petId),
    enabled: sessao !== undefined,
  });
}
