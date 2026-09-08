import { requisitar } from "./api";

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
  return requisitar<ResponsavelApiResponse>(`/api/responsaveis/${id}`, { token });
}

export async function atualizarResponsavel(
  id: number,
  dados: ResponsavelRequestBody,
  token: string,
): Promise<ResponsavelApiResponse> {
  return requisitar<ResponsavelApiResponse>(`/api/responsaveis/${id}`, {
    metodo: "PUT",
    corpo: dados,
    token,
  });
}

export async function excluirResponsavel(id: number, token: string): Promise<void> {
  await requisitar<{ mensagem: string }>(`/api/responsaveis/${id}`, {
    metodo: "DELETE",
    token,
  });
}
