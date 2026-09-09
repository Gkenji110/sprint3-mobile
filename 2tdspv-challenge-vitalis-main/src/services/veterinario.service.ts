import { VeterinarioApiResponse, veterinarioApiResponseSchema } from "@/schemas/api/veterinario.api.schema";
import { apiClient } from "./api";

export type { VeterinarioApiResponse };

/**
 * Corpo de `PUT /api/veterinarios/{id}`.
 *
 * `senha` é exigida pelo backend mesmo em atualização (`VeterinarioRequest`
 * valida `@NotBlank` sem diferenciar criação de edição) — igual ao que já
 * acontece com o responsável. `crmv` é ignorado pelo `VeterinarioMapper`
 * no update (`@Mapping(target = "crmv", ignore = true)`), então mandamos o
 * valor atual só porque o DTO exige o campo, mas o backend não usa.
 */
export type VeterinarioRequestBody = {
  nome: string;
  crmv: string;
  especialidade?: string;
  email: string;
  telefone?: string;
  senha: string;
  ativo: boolean;
};

export async function buscarVeterinarioPorId(
  id: number,
  token: string,
): Promise<VeterinarioApiResponse> {
  const resposta = await apiClient.get(`/api/veterinarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return veterinarioApiResponseSchema.parse(resposta);
}

export async function atualizarVeterinario(
  id: number,
  dados: VeterinarioRequestBody,
  token: string,
): Promise<VeterinarioApiResponse> {
  const resposta = await apiClient.put(`/api/veterinarios/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return veterinarioApiResponseSchema.parse(resposta);
}

export async function excluirVeterinario(id: number, token: string): Promise<void> {
  await apiClient.delete(`/api/veterinarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
