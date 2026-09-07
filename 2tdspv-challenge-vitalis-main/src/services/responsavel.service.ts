import { requisitar } from "./api";

/**
 * Cadastro do responsável, como o `pethub-java` devolve em `GET
 * /api/responsaveis/{id}`.
 *
 * Existe separado do `Sessao` porque o login não deveria virar um mini-perfil:
 * quem devolve dado de perfil é o recurso `responsavel`, não a autenticação —
 * o mesmo padrão do `/userinfo` do OpenID Connect. Hoje só o `cpf` é usado
 * (exigido por `POST /api/pets`); `enderecos`/`contatos` ficam pendurados no
 * tipo pra quando a UI de perfil precisar deles.
 */
export type ResponsavelApiResponse = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  ativo: boolean;
  createdAt: string;
};

export async function buscarResponsavelPorId(
  id: number,
  token: string,
): Promise<ResponsavelApiResponse> {
  return requisitar<ResponsavelApiResponse>(`/api/responsaveis/${id}`, { token });
}
