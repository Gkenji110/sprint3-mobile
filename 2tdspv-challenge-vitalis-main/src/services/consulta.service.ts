import { ConsultaApiResponse, paginaDeConsultasSchema } from "@/schemas/api/consulta.api.schema";
import { apiClient } from "./api";

export type { ConsultaApiResponse };

/**
 * Só leitura: `SecurityConfig` coloca `/api/consultas/**` em `ROTAS_CLINICAS`,
 * onde `GET` é liberado para VETERINARIO e RESPONSAVEL, mas escrever
 * (agendar/editar/cancelar) exige VETERINARIO. Este app é a interface do
 * tutor, então só consome a leitura — agendamento de consulta é o
 * veterinário/clínica quem faz, fora do escopo deste projeto.
 */
const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** Consultas do tutor logado. O backend já filtra pelos pets dele via token. */
export async function listarMinhasConsultas(token: string): Promise<ConsultaApiResponse[]> {
  const resposta = await apiClient.get(`/api/consultas?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return paginaDeConsultasSchema.parse(resposta).content;
}
