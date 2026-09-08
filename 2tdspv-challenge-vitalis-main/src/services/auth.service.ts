import { Perfil, respostaDeLoginSchema } from "@/schemas/api/auth.api.schema";
import { CadastroInput, LoginInput } from "@/schemas/auth.schema";
import { CadastroVeterinarioInput } from "@/schemas/cadastroVeterinario.schema";
import { apiClient } from "./api";

/**
 * Autenticação contra o `pethub-java`.
 *
 * Sabe o que é login e não sabe o que é React: nenhum hook, nenhum componente.
 * Isso mantém a regra de negócio testável e fora da árvore de renderização.
 *
 * `POST /api/auth/login` é o mesmo endpoint para os dois perfis — quem
 * distingue tutor de veterinário é o `perfil` que volta na resposta, não a
 * rota chamada.
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

export async function autenticar(credenciais: LoginInput): Promise<Sessao> {
  const resposta = await apiClient.post("/api/auth/login", credenciais);
  const resultado = respostaDeLoginSchema.parse(resposta);

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

/** Mesma ideia de `registrarTutor`, para `POST /api/auth/registrar/veterinario`. */
export async function registrarVeterinario(dados: CadastroVeterinarioInput): Promise<Sessao> {
  const resposta = await apiClient.post("/api/auth/registrar/veterinario", {
    nome: dados.nome,
    crmv: dados.crmv,
    especialidade: dados.especialidade || undefined,
    email: dados.email,
    senha: dados.senha,
  });
  const resultado = respostaDeLoginSchema.parse(resposta);

  return { ...resultado, email: dados.email };
}
