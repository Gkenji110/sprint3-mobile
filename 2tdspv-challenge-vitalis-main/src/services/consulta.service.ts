import { extrairMensagemDeErro, URL_BASE } from "./api";

/**
 * Consulta como o `pethub-java` devolve em `GET /api/consultas`.
 *
 * Só leitura: `SecurityConfig` coloca `/api/consultas/**` em `ROTAS_CLINICAS`,
 * onde `GET` é liberado para VETERINARIO e RESPONSAVEL, mas escrever
 * (agendar/editar/cancelar) exige VETERINARIO. Este app é a interface do
 * tutor, então só consome a leitura — agendamento de consulta é o
 * veterinário/clínica quem faz, fora do escopo deste projeto.
 */
export type ConsultaApiResponse = {
  id: number;
  dataHora: string;
  tipo: "PRESENCIAL" | "TELECONSULTA";
  observacoes?: string;
  status: "AGENDADA" | "REALIZADA" | "CANCELADA";
  nomePet: string;
  nomeVeterinario: string;
  nomeUnidade: string;
};

type PaginaDeConsultas = {
  content: ConsultaApiResponse[];
};

const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** Consultas do tutor logado. O backend já filtra pelos pets dele via token. */
export async function listarMinhasConsultas(token: string): Promise<ConsultaApiResponse[]> {
  const response = await fetch(`${URL_BASE}/api/consultas?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível carregar as consultas"));
  }

  const pagina: PaginaDeConsultas = await response.json();
  return pagina.content;
}
