import * as z from "zod";

export const STATUS_VACINA = ["Aplicada", "Pendente", "Atrasada"] as const;
export type StatusVacina = (typeof STATUS_VACINA)[number];

export const VacinaSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório").trim(),
  dataAplicacao: z.string().min(1, "Data de aplicação obrigatória"),
  proximaDose: z.string().optional(),
  status: z.enum(STATUS_VACINA, { message: "Selecione um status" }),
  petIndex: z.number(),
});

export type VacinaInput = z.infer<typeof VacinaSchema>;