import { Perfil, respostaDeLoginSchema } from "@/schemas/api/auth.api.schema";
import { CadastroInput, LoginInput } from "@/schemas/auth.schema";
import { apiClient } from "./api";

/**
 * Autenticação contra o `pethub-java`.
 *
 * Sabe o que é login e não sabe o que é React: nenhum hook, nenhum componente.
 * Isso mantém a regra de negócio testável e fora da árvore de renderização.
 */

export type Sessao = {
  token: string;
  perfil: Perfil;
  nome: string;
  id: number;
  /**
   * O backend não devolve o email, então guardamos o que foi digitado. Serve
   * apenas para a interface ter o que exibir; a identidade que vale é o token.
   */
  email: string;
};

/** Este aplicativo é a interface do tutor. O veterinário tem o portal dele. */
const PERFIL_DO_APP: Perfil = "RESPONSAVEL";

export async function autenticarComoTutor(credenciais: LoginInput): Promise<Sessao> {
  const resposta = await apiClient.post("/api/auth/login", credenciais);
  const resultado = respostaDeLoginSchema.parse(resposta);

  if (resultado.perfil !== PERFIL_DO_APP) {
    throw new Error(
      "Este aplicativo é para tutores. Veterinários devem usar o portal da clínica.",
    );
  }

  return { ...resultado, email: credenciais.email };
}

/**
 * Cria o tutor e já devolve a sessão.
 *
 * O backend responde o mesmo corpo do login, então cadastrar autentica de uma
 * vez: não faz sentido pedir a senha de novo na tela seguinte.
 */
export async function registrarTutor(dados: CadastroInput): Promise<Sessao> {
  const resposta = await apiClient.post("/api/auth/registrar/responsavel", {
    // `confirmarSenha` existe só para a validação do formulário, e `ativo` o
    // backend assume como verdadeiro quando ausente.
    nome: dados.nome,
    cpf: dados.cpf,
    email: dados.email,
    senha: dados.senha,
  });
  const resultado = respostaDeLoginSchema.parse(resposta);

  return { ...resultado, email: dados.email };
}
