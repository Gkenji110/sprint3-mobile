import * as z from "zod";

export const ResponsavelSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório").trim(),
  email: z.string().email("Email inválido").toLowerCase().trim(),
  telefone: z.string().min(11, "Telefone inválido").trim(),
});

export type ResponsavelInput = z.infer<typeof ResponsavelSchema>;