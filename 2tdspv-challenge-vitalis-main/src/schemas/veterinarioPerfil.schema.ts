import * as z from "zod";

/**
 * O backend exige `senha` em todo `PUT /api/veterinarios/{id}`, mesmo numa
 * edição que não muda a senha — igual ao que já acontece no Perfil do
 * responsável. `crmv` fica fora daqui de propósito: o `VeterinarioMapper`
 * ignora esse campo no update, então não faz sentido deixá-lo editável.
 */
export const VeterinarioPerfilSchema = z
  .object({
    nome: z.string().min(1, "Nome obrigatório").trim(),
    especialidade: z.string().trim().optional(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  });

export type VeterinarioPerfilInput = z.infer<typeof VeterinarioPerfilSchema>;
