import { ResponsavelApiResponse, responsavelApiResponseSchema } from "@/schemas/api/responsavel.api.schema";
import { apiClient } from "./api";

export type { ResponsavelApiResponse };

/**
 * Corpo de `PUT /api/responsaveis/{id}`.
 *
 * `senha` é exigida pelo backend mesmo em atualização (`ResponsavelRequest`
 * valida `@NotBlank` sem diferenciar criação de edição) — não existe PUT sem
 * senha. `ativo` também precisa ser sempre enviado: `ResponsavelMapper` não
 * ignora esse campo no `updateEntity`, então omiti-lo zeraria a conta.
 */
export type ResponsavelRequestBody = {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  ativo: boolean;
};

export async function buscarResponsavelPorId(
  id: number,
  token: string,
): Promise<ResponsavelApiResponse> {
  const resposta = await apiClient.get(`/api/responsaveis/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return responsavelApiResponseSchema.parse(resposta);
}

export async function atualizarResponsavel(
  id: number,
  dados: ResponsavelRequestBody,
  token: string,
): Promise<ResponsavelApiResponse> {
  const resposta = await apiClient.put(`/api/responsaveis/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return responsavelApiResponseSchema.parse(resposta);
}

export async function excluirResponsavel(id: number, token: string): Promise<void> {
  await apiClient.delete(`/api/responsaveis/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
