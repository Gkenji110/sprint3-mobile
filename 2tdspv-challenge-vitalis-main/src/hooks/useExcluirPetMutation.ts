import { useAuth } from "@/context/AuthContext";
import { excluirPet } from "@/services/pet.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExcluirPetMutation() {
  const { sessao } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => excluirPet(id, sessao!.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}
