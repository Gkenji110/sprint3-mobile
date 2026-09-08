import * as z from "zod";

/**
 * O backend exige `senha` em todo `PUT /api/responsaveis/{id}`, mesmo numa
 * edição que não muda a senha — não existe atualização sem ela. Por isso o
 * campo (com confirmação) aparece aqui também, e não só no cadastro.
 */
export const ResponsavelSchema = z
  .object({
    nome: z.string().min(1, "Nome obrigatório").trim(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  });

export type ResponsavelInput = z.infer<typeof ResponsavelSchema>;
