import * as z from "zod";

export const STATUS_CONSULTA = ["Agendada", "Concluída", "Cancelada"] as const;
export type StatusConsulta = (typeof STATUS_CONSULTA)[number];

export const ConsultaSchema = z.object({
  veterinario: z.string().min(1, "Veterinário obrigatório"),
  clinica: z.string().min(1, "Clínica obrigatória"),
  data: z.string().min(1, "Data obrigatória"),
  hora: z.string().min(1, "Hora obrigatória"),
  status: z.enum(STATUS_CONSULTA),
  pet: z.string().min(1, "Pet obrigatório"),
});

export type ConsultaInput = z.infer<typeof ConsultaSchema>;