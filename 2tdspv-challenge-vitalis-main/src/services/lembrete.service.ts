import { extrairMensagemDeErro, URL_BASE } from "./api";

/**
 * Lembrete como o `pethub-java` devolve em `GET /api/lembretes`.
 *
 * `tipo` e `status` são enums de verdade no backend (ao contrário de
 * `especie`/`genero` de pet, que são texto livre) — por isso o mobile usa o
 * mesmo conjunto fechado de valores, não um vocabulário próprio.
 */
export type TipoLembrete = "VACINA" | "CONSULTA" | "EXAME" | "MEDICAMENTO" | "HIDRATACAO";
export type StatusLembrete = "PENDENTE" | "ENVIADO" | "FALHOU";

export type LembreteApiResponse = {
  id: number;
  responsavelId: number;
  nomeResponsavel: string;
  petId: number;
  nomePet: string;
  tipo: TipoLembrete;
  dataAgendada: string;
  mensagem: string;
  status: StatusLembrete;
  referenciaId?: number;
  referenciaTipo?: string;
  createdAt: string;
};

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

type PaginaDeLembretes = {
  content: LembreteApiResponse[];
};

const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** Lembretes do tutor logado. O backend já filtra pelo responsável via escopo. */
export async function listarMeusLembretes(token: string): Promise<LembreteApiResponse[]> {
  const response = await fetch(`${URL_BASE}/api/lembretes?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível carregar os lembretes"));
  }

  const pagina: PaginaDeLembretes = await response.json();
  return pagina.content;
}

export async function criarLembrete(
  dados: LembreteRequestBody,
  token: string,
): Promise<LembreteApiResponse> {
  const response = await fetch(`${URL_BASE}/api/lembretes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível criar o lembrete"));
  }

  return response.json();
}

export async function atualizarLembrete(
  id: number,
  dados: LembreteRequestBody,
  token: string,
): Promise<LembreteApiResponse> {
  const response = await fetch(`${URL_BASE}/api/lembretes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível atualizar o lembrete"));
  }

  return response.json();
}

export async function excluirLembrete(id: number, token: string): Promise<void> {
  const response = await fetch(`${URL_BASE}/api/lembretes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível excluir o lembrete"));
  }
}
