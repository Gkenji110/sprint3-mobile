import { useAuth } from "@/context/AuthContext";
import { atualizarPet } from "@/services/pet.service";
import { DadosDoFormularioDePet } from "./useCriarPetMutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petsQueryKey } from "./usePets";
import { router } from "expo-router";

export function useEditarPetMutation(id: number) {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: DadosDoFormularioDePet) =>
      atualizarPet(id, { ...dados, veterinarioResponsavelId: sessao!.id }, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petsQueryKey });
      router.back();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
