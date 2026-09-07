import * as z from "zod";

export const CadastroSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório").trim(),
  // O backend exige exatamente 11 dígitos, sem pontuação.
  cpf: z.string().trim().regex(/^\d{11}$/, "CPF deve ter 11 dígitos, sem pontos ou traços"),
  email: z.string().email("Email inválido").toLowerCase().trim(),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não conferem",
  path: ["confirmarSenha"],
});

export const LoginSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase().trim(),
  senha: z.string().min(1, "Senha obrigatória"),
});

export type CadastroInput = z.infer<typeof CadastroSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;