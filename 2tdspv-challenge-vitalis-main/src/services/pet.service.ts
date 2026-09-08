import { paginaDePetsSchema, PetApiResponse } from "@/schemas/api/pet.api.schema";
import { apiClient } from "./api";

export type { PetApiResponse };

/**
 * O backend pagina por padrão (Spring Data). A UI ainda não tem paginação,
 * então pede uma página grande o bastante pra cobrir os pets de um tutor. Se
 * isso um dia não bastar, o certo é construir paginação de verdade — não
 * aumentar esse número.
 */
const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** Pets do tutor logado. O backend já filtra pelo token — não há id pra passar. */
export async function listarMeusPets(token: string): Promise<PetApiResponse[]> {
  const resposta = await apiClient.get(`/api/pets?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return paginaDePetsSchema.parse(resposta).content;
}

/**
 * Só leitura, de propósito: o `SecurityConfig` do `pethub-java` restringe
 * `POST`/`PUT`/`DELETE /api/pets` ao perfil VETERINARIO (`ROTAS_ADMINISTRATIVAS`
 * — "cadastros que só o veterinário administra"). Este app é a interface do
 * tutor (RESPONSAVEL), que só tem `GET` liberado nesse recurso; tentativas de
 * escrita aqui sempre voltariam 403. Cadastro/edição/exclusão de pet
 * pertencem a um futuro app do veterinário, fora do escopo deste projeto.
 */
