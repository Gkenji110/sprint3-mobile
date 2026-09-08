import {
  LembreteApiResponse,
  lembreteApiResponseSchema,
  paginaDeLembretesSchema,
  StatusLembrete,
  TipoLembrete,
} from "@/schemas/api/lembrete.api.schema";
import { apiClient } from "./api";

export type { LembreteApiResponse, StatusLembrete, TipoLembrete };

/**
 * Corpo de `POST`/`PUT /api/lembretes`.
 *
 * `responsavelId` é exigido pelo backend mesmo autenticado — o filtro por
 * dono só se aplica à listagem (`GET`), não à escrita — por isso o mobile
 * sempre manda o id do tutor logado (`sessao.id`).
 */
export type LembreteRequestBody = {
  responsavelId: number;
  petId: number;
  tipo: TipoLembrete;
  dataAgendada: string;
  mensagem: string;
};

const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** Lembretes do tutor logado. O backend já filtra pelo responsável via escopo. */
export async function listarMeusLembretes(token: string): Promise<LembreteApiResponse[]> {
  const resposta = await apiClient.get(`/api/lembretes?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return paginaDeLembretesSchema.parse(resposta).content;
}

export async function criarLembrete(
  dados: LembreteRequestBody,
  token: string,
): Promise<LembreteApiResponse> {
  const resposta = await apiClient.post("/api/lembretes", dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return lembreteApiResponseSchema.parse(resposta);
}

export async function atualizarLembrete(
  id: number,
  dados: LembreteRequestBody,
  token: string,
): Promise<LembreteApiResponse> {
  const resposta = await apiClient.put(`/api/lembretes/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return lembreteApiResponseSchema.parse(resposta);
}

export async function excluirLembrete(id: number, token: string): Promise<void> {
  await apiClient.delete(`/api/lembretes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
