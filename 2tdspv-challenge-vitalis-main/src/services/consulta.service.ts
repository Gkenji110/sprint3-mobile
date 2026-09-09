import { consultaApiResponseSchema, ConsultaApiResponse, paginaDeConsultasSchema } from "@/schemas/api/consulta.api.schema";
import { apiClient } from "./api";

export type { ConsultaApiResponse };

/**
 * `SecurityConfig` coloca `/api/consultas/**` em `ROTAS_CLINICAS`: `GET` é
 * liberado para VETERINARIO e RESPONSAVEL, mas escrever (agendar/editar)
 * exige VETERINARIO. O backend já filtra a listagem pelo escopo de quem
 * pede — tutor vê só os pets dele, veterinário vê tudo.
 */
const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

export async function listarMinhasConsultas(token: string): Promise<ConsultaApiResponse[]> {
  const resposta = await apiClient.get(`/api/consultas?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return paginaDeConsultasSchema.parse(resposta).content;
}

/** Corpo de `POST /api/consultas` — só o veterinário chega aqui (rota administrativa). */
export type ConsultaAgendarRequestBody = {
  dataHora: string;
  tipo: "PRESENCIAL" | "TELECONSULTA";
  observacoes?: string;
  status: "AGENDADA" | "REALIZADA" | "CANCELADA";
  petId: number;
  veterinarioId: number;
  unidadeId: number;
};

export async function agendarConsulta(
  dados: ConsultaAgendarRequestBody,
  token: string,
): Promise<ConsultaApiResponse> {
  const resposta = await apiClient.post("/api/consultas", dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return consultaApiResponseSchema.parse(resposta);
}

/**
 * Corpo de `PUT /api/consultas/{id}`.
 *
 * `petId`/`veterinarioId` continuam exigidos pelo `@NotNull` do
 * `ConsultaRequest` mesmo em edição, mas o `ConsultaMapper.updateEntity`
 * ignora os dois no update — então o valor em si não muda nada, só precisa
 * estar presente pra passar na validação do backend.
 *
 * `unidadeId` é diferente: `ConsultaService.update` chama `applyUnidade`,
 * que faz `unidadeRepository.findById(unidadeId)` de verdade — omitir esse
 * campo manda `null` pro backend e derruba a chamada com 500 (o
 * `findById(null)` do Spring Data não vira um 404 tratado, vira exceção não
 * capturada). Então, ao contrário de `petId`/`veterinarioId`, aqui o valor
 * PRECISA ser o ID real de uma unidade existente.
 *
 * `GET /api/consultas` não devolve nenhum desses IDs (só os nomes), então
 * quem chama precisa achá-los de volta por fora — casando `nomePet`/
 * `nomeUnidade` contra a lista de pacientes/unidades do próprio veterinário.
 */
export type ConsultaAtualizarRequestBody = {
  dataHora: string;
  tipo: "PRESENCIAL" | "TELECONSULTA";
  observacoes?: string;
  status: "AGENDADA" | "REALIZADA" | "CANCELADA";
  petId: number;
  veterinarioId: number;
  unidadeId: number;
};

export async function atualizarConsulta(
  id: number,
  dados: ConsultaAtualizarRequestBody,
  token: string,
): Promise<ConsultaApiResponse> {
  const resposta = await apiClient.put(`/api/consultas/${id}`, dados, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return consultaApiResponseSchema.parse(resposta);
}
