import {
  paginaDeVacinasTratamentosSchema,
  VacinaTratamentoApiResponse,
  vacinaTratamentoApiResponseSchema,
} from "@/schemas/api/vacinaTratamento.api.schema";
import { apiClient } from "./api";

export type { VacinaTratamentoApiResponse };

/**
 * `SecurityConfig` coloca `/api/vacinas-tratamentos/**` em `ROTAS_CLINICAS`:
 * `GET` é liberado para VETERINARIO e RESPONSAVEL, mas escrever (registrar/
 * editar/excluir) exige VETERINARIO. O backend já filtra pelo escopo de quem
 * pede — tutor vê só as dos pets dele, veterinário vê todas.
 */
const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** `petId` filtra pra um único pet — usado na tela de detalhes do pet do tutor. */
export async function listarVacinasTratamentos(
  token: string,
  petId?: number,
): Promise<VacinaTratamentoApiResponse[]> {
  const filtro = petId !== undefined ? `&petId=${petId}` : "";
  const resposta = await apiClient.get(
    `/api/vacinas-tratamentos?size=${TAMANHO_SEM_PAGINACAO_NA_UI}${filtro}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return paginaDeVacinasTratamentosSchema.parse(resposta).content;
}

/** Corpo de `POST /api/vacinas-tratamentos` — só o veterinário chega aqui (rota clínica). */
export type VacinaTratamentoRegistrarRequestBody = {
  tipo: "VACINA" | "MEDICAMENTO" | "PROCEDIMENTO";
  nome: string;
  dataAplicacao: string;
  proximaDose?: string;
  dose?: string;
  observacoes?: string;
  petId: number;
  veterinarioId: number;
  consultaId?: number;
};

export async function registrarVacinaTratamento(
  dados: VacinaTratamentoRegistrarRequestBody,
  token: string,
): Promise<VacinaTratamentoApiResponse> {
  const resposta = await apiClient.post("/api/vacinas-tratamentos", dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return vacinaTratamentoApiResponseSchema.parse(resposta);
}

/**
 * Corpo de `PUT /api/vacinas-tratamentos/{id}`.
 *
 * `petId`/`veterinarioId` continuam exigidos pelo `@NotNull` de
 * `VacinaTratamentoRequest` mesmo em edição, mas
 * `VacinaTratamentoMapper.updateEntity` ignora os dois (e `consultaId`) no
 * update — só precisam estar presentes pra passar na validação do backend,
 * o valor em si não é usado (mesmo padrão de `petId`/`veterinarioId` em
 * `ConsultaService.update`).
 *
 * `GET /api/vacinas-tratamentos` não devolve nenhum desses IDs (só os
 * nomes), então quem chama precisa achar `petId` de volta por fora —
 * casando `nomePet` contra a lista de pacientes do veterinário.
 */
export type VacinaTratamentoAtualizarRequestBody = VacinaTratamentoRegistrarRequestBody;

export async function atualizarVacinaTratamento(
  id: number,
  dados: VacinaTratamentoAtualizarRequestBody,
  token: string,
): Promise<VacinaTratamentoApiResponse> {
  const resposta = await apiClient.put(`/api/vacinas-tratamentos/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return vacinaTratamentoApiResponseSchema.parse(resposta);
}

export async function excluirVacinaTratamento(id: number, token: string): Promise<void> {
  await apiClient.delete(`/api/vacinas-tratamentos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
