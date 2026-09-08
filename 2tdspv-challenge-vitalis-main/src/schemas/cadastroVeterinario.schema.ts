import * as z from "zod";

export const CadastroVeterinarioSchema = z
  .object({
    nome: z.string().min(1, "Nome obrigatório").trim(),
    crmv: z.string().min(1, "CRMV obrigatório").trim(),
    especialidade: z.string().trim().optional(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  });

export type CadastroVeterinarioInput = z.infer<typeof CadastroVeterinarioSchema>;
