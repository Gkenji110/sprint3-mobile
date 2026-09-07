import { CadastroInput, LoginInput } from "@/schemas/auth.schema";
import { ErroDaApi, requisitar } from "./api";

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

const NAO_AUTORIZADO = 403;

export async function autenticarComoTutor(credenciais: LoginInput): Promise<Sessao> {
  const resposta = await requisitar<RespostaDeLogin>("/api/auth/login", {
    metodo: "POST",
    corpo: credenciais,
  });

  if (resposta.perfil !== PERFIL_DO_APP) {
    throw new ErroDaApi(
      NAO_AUTORIZADO,
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
  const resposta = await requisitar<RespostaDeLogin>("/api/auth/registrar/responsavel", {
    metodo: "POST",
    // `confirmarSenha` existe só para a validação do formulário, e `ativo` o
    // backend assume como verdadeiro quando ausente.
    corpo: {
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      senha: dados.senha,
    },
  });

  return { ...resposta, email: dados.email };
}
