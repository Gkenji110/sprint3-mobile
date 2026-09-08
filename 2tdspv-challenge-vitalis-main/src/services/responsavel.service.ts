import { extrairMensagemDeErro, URL_BASE } from "./api";

/**
 * Responsável (tutor) como o `pethub-java` devolve em `GET /api/responsaveis/{id}`.
 *
 * `telefone` não existe aqui — mora no sub-recurso `/api/responsaveis/{id}/contatos`,
 * fora do escopo deste app por enquanto.
 */
export type ResponsavelApiResponse = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  ativo: boolean;
  createdAt: string;
};

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
  const response = await fetch(`${URL_BASE}/api/responsaveis/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível carregar o perfil"));
  }

  return response.json();
}

export async function atualizarResponsavel(
  id: number,
  dados: ResponsavelRequestBody,
  token: string,
): Promise<ResponsavelApiResponse> {
  const response = await fetch(`${URL_BASE}/api/responsaveis/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível atualizar o perfil"));
  }

  return response.json();
}

export async function excluirResponsavel(id: number, token: string): Promise<void> {
  const response = await fetch(`${URL_BASE}/api/responsaveis/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível excluir o perfil"));
  }
}
