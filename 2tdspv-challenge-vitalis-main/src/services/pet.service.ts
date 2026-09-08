import { paginaDePetsSchema, PetApiResponse, petApiResponseSchema } from "@/schemas/api/pet.api.schema";
import { apiClient } from "./api";

export type { PetApiResponse };

/**
 * Corpo de `POST`/`PUT /api/pets`.
 *
 * `responsavelCpf` é como o backend descobre o dono: busca o responsável por
 * esse CPF e vincula o pet a ele — por isso é obrigatório mesmo numa edição
 * que não muda o tutor. `veterinarioResponsavelId` é opcional; o app sempre
 * manda o id de quem está logado (`sessao.id`).
 */
export type PetRequestBody = {
  nome: string;
  especie: string;
  raca?: string;
  idade?: number;
  peso?: number;
  genero?: string;
  responsavelCpf: string;
  veterinarioResponsavelId?: number;
};

/**
 * O backend pagina por padrão (Spring Data). A UI ainda não tem paginação,
 * então pede uma página grande o bastante pra cobrir os pets. Se isso um dia
 * não bastar, o certo é construir paginação de verdade — não aumentar esse
 * número.
 */
const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/**
 * Pets visíveis para quem está logado: o tutor só vê os seus, o veterinário
 * vê todos — o backend já aplica esse filtro pelo token, sem precisar de
 * parâmetro nenhum aqui (`EscopoDoUsuario`, no `pethub-java`).
 */
export async function listarMeusPets(token: string): Promise<PetApiResponse[]> {
  const resposta = await apiClient.get(`/api/pets?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return paginaDePetsSchema.parse(resposta).content;
}

/**
 * Cadastrar, editar e excluir pet são ações exclusivas do veterinário: o
 * `SecurityConfig` do `pethub-java` restringe `POST`/`PUT`/`DELETE /api/pets`
 * ao perfil VETERINARIO (`ROTAS_ADMINISTRATIVAS`). Chamar essas funções
 * autenticado como tutor sempre volta 403 — e é assim que deve ser: o app do
 * tutor nunca deve dar a essas telas.
 */
export async function criarPet(dados: PetRequestBody, token: string): Promise<PetApiResponse> {
  const resposta = await apiClient.post("/api/pets", dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return petApiResponseSchema.parse(resposta);
}

export async function atualizarPet(
  id: number,
  dados: PetRequestBody,
  token: string,
): Promise<PetApiResponse> {
  const resposta = await apiClient.put(`/api/pets/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return petApiResponseSchema.parse(resposta);
}

export async function excluirPet(id: number, token: string): Promise<void> {
  await apiClient.delete(`/api/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
