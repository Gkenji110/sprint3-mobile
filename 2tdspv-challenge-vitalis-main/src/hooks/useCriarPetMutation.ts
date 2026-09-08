import { useAuth } from "@/context/AuthContext";
import { criarPet, PetRequestBody } from "@/services/pet.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

/** O que o formulário coleta — sem `veterinarioResponsavelId`, que vem da sessão. */
export type DadosDoFormularioDePet = Omit<PetRequestBody, "veterinarioResponsavelId">;

export function useCriarPetMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: DadosDoFormularioDePet) =>
      criarPet({ ...dados, veterinarioResponsavelId: sessao!.id }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      router.back();
    },
  });
}
