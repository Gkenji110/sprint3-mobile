import * as z from "zod";

export const TIPOS_LEMBRETE = [
  "Vacina",
  "Consulta",
  "Medicamento",
  "Check-up",
  "Outro",
] as const;
export type TipoLembrete = (typeof TIPOS_LEMBRETE)[number];

export const LembreteSchema = z.object({
  titulo: z.string().min(1, "Título obrigatório").trim(),
  data: z.string().min(1, "Data obrigatória"),
  hora: z.string().min(1, "Hora obrigatória"),
  tipo: z.enum(TIPOS_LEMBRETE, { message: "Selecione um tipo" }),
  petNome: z.string().min(1, "Pet obrigatório"),
});

export type LembreteInput = z.infer<typeof LembreteSchema>;