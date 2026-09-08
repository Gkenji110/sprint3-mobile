import { CadastroInput, LoginInput } from "@/schemas/auth.schema";
import { extrairMensagemDeErro, URL_BASE } from "./api";

/**
 * Autenticação contra o `pethub-java`.
 *
 * Sabe o que é login e não sabe o que é React: nenhum hook, nenhum componente.
 * Isso mantém a regra de negócio testável e fora da árvore de renderização.
 */

export type Perfil = "RESPONSAVEL" | "VETERINARIO";

/** Corpo que `POST /api/auth/login` devolve. */
type RespostaDeLogin = {
  token: string;
  perfil: Perfil;
  nome: string;
  id: number;
};

export type Sessao = RespostaDeLogin & {
  /**
   * O backend não devolve o email, então guardamos o que foi digitado. Serve
   * apenas para a interface ter o que exibir; a identidade que vale é o token.
   */
  email: string;
};

/** Este aplicativo é a interface do tutor. O veterinário tem o portal dele. */
const PERFIL_DO_APP: Perfil = "RESPONSAVEL";

export async function autenticarComoTutor(credenciais: LoginInput): Promise<Sessao> {
  const response = await fetch(`${URL_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciais),
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível fazer login"));
  }

  const resposta: RespostaDeLogin = await response.json();

  if (resposta.perfil !== PERFIL_DO_APP) {
    throw new Error(
      "Este aplicativo é para tutores. Veterinários devem usar o portal da clínica.",
    );
  }

  return { ...resposta, email: credenciais.email };
}

/**
 * Cria o tutor e já devolve a sessão.
 *
 * O backend responde o mesmo corpo do login, então cadastrar autentica de uma
 * vez: não faz sentido pedir a senha de novo na tela seguinte.
 */
export async function registrarTutor(dados: CadastroInput): Promise<Sessao> {
  const response = await fetch(`${URL_BASE}/api/auth/registrar/responsavel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // `confirmarSenha` existe só para a validação do formulário, e `ativo` o
    // backend assume como verdadeiro quando ausente.
    body: JSON.stringify({
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      senha: dados.senha,
    }),
  });

  if (!response.ok) {
    throw new Error(await extrairMensagemDeErro(response, "Não foi possível cadastrar o tutor"));
  }

  const resposta: RespostaDeLogin = await response.json();
  return { ...resposta, email: dados.email };
}
