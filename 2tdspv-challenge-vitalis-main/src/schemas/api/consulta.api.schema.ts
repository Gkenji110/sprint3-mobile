import { z } from "zod";

/**
 * Consulta como o `pethub-java` devolve em `GET /api/consultas`.
 *
 * Só leitura: `SecurityConfig` coloca `/api/consultas/**` em `ROTAS_CLINICAS`,
 * onde `GET` é liberado para VETERINARIO e RESPONSAVEL, mas escrever
 * (agendar/editar/cancelar) exige VETERINARIO.
 */
export const consultaApiResponseSchema = z.object({
  id: z.number(),
  dataHora: z.string(),
  tipo: z.enum(["PRESENCIAL", "TELECONSULTA"]),
  observacoes: z.string().optional(),
  status: z.enum(["AGENDADA", "REALIZADA", "CANCELADA"]),
  nomePet: z.string(),
  nomeVeterinario: z.string(),
  nomeUnidade: z.string(),
});

export type ConsultaApiResponse = z.infer<typeof consultaApiResponseSchema>;

export const paginaDeConsultasSchema = z.object({
  content: z.array(consultaApiResponseSchema),
});
