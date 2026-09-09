import * as z from "zod";

/** `tipo` e `status` são enums de verdade no backend — mesmo vocabulário fechado. */
export const TIPOS_CONSULTA = ["PRESENCIAL", "TELECONSULTA"] as const;
export type TipoConsulta = (typeof TIPOS_CONSULTA)[number];

export const TIPO_CONSULTA_LABEL: Record<TipoConsulta, string> = {
  PRESENCIAL: "Presencial",
  TELECONSULTA: "Teleconsulta",
};

export const STATUS_CONSULTA = ["AGENDADA", "REALIZADA", "CANCELADA"] as const;
export type StatusConsulta = (typeof STATUS_CONSULTA)[number];

export const STATUS_CONSULTA_LABEL: Record<StatusConsulta, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
};

/** Agendar uma consulta nova: escolhe pet, unidade, tipo e data/hora. */
export const ConsultaAgendarSchema = z.object({
  petId: z.number({ message: "Pet obrigatório" }),
  unidadeId: z.number({ message: "Unidade obrigatória" }),
  tipo: z.enum(TIPOS_CONSULTA, { message: "Selecione um tipo" }),
  dataHora: z.string().min(1, "Data e hora obrigatórias"),
  observacoes: z.string().trim().optional(),
});

export type ConsultaAgendarInput = z.infer<typeof ConsultaAgendarSchema>;

/**
 * Editar uma consulta existente: pet, veterinário e unidade não mudam depois
 * de criada (`ConsultaMapper.updateEntity` ignora esses três campos no PUT),
 * então só tipo, data/hora, status e observações ficam editáveis. Mudar o
 * status pra CANCELADA é como se cancela uma consulta — não existe endpoint
 * separado pra isso.
 */
export const ConsultaEditarSchema = z.object({
  tipo: z.enum(TIPOS_CONSULTA, { message: "Selecione um tipo" }),
  dataHora: z.string().min(1, "Data e hora obrigatórias"),
  status: z.enum(STATUS_CONSULTA, { message: "Selecione um status" }),
  observacoes: z.string().trim().optional(),
});

export type ConsultaEditarInput = z.infer<typeof ConsultaEditarSchema>;
