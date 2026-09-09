import { paginaDeUnidadesSchema, UnidadeApiResponse } from "@/schemas/api/unidade.api.schema";
import { apiClient } from "./api";

export type { UnidadeApiResponse };

const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/**
 * Unidades veterinárias cadastradas — usado só pra escolher qual unidade
 * atende a consulta. Cadastrar/editar unidade é administrativo, fora do
 * escopo do app.
 */
export async function listarUnidades(token: string): Promise<UnidadeApiResponse[]> {
  const resposta = await apiClient.get(`/api/unidades?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return paginaDeUnidadesSchema.parse(resposta).content;
}
