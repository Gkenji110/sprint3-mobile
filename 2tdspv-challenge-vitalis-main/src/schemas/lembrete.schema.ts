import * as z from "zod";

/**
 * `tipo` é um enum de verdade no backend (`fiap.pethub.enums.TipoLembrete`),
 * não texto livre — os valores precisam bater exatamente com o Java.
 */
export const TIPOS_LEMBRETE = [
  "VACINA",
  "CONSULTA",
  "EXAME",
  "MEDICAMENTO",
  "HIDRATACAO",
] as const;
export type TipoLembrete = (typeof TIPOS_LEMBRETE)[number];

export const TIPO_LEMBRETE_LABEL: Record<TipoLembrete, string> = {
  VACINA: "Vacina",
  CONSULTA: "Consulta",
  EXAME: "Exame",
  MEDICAMENTO: "Medicamento",
  HIDRATACAO: "Hidratação",
};

/**
 * `dataAgendada` no backend é `LocalDate` — só data, sem hora. O formulário
 * não pede hora de propósito: não há onde persistir esse dado na API.
 */
export const LembreteSchema = z.object({
  mensagem: z.string().min(1, "Mensagem obrigatória").trim(),
  dataAgendada: z.string().min(1, "Data obrigatória"),
  tipo: z.enum(TIPOS_LEMBRETE, { message: "Selecione um tipo" }),
  petId: z.number({ message: "Pet obrigatório" }),
});

export type LembreteInput = z.infer<typeof LembreteSchema>;
