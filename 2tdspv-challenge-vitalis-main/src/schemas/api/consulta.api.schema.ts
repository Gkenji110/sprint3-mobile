import { z } from "zod";

/**
 * Consulta como o `pethub-java` devolve em `GET /api/consultas`.
 *
 * Só leitura: `SecurityConfig` coloca `/api/consultas/**` em `ROTAS_CLINICAS`,
 * onde `GET` é liberado para VETERINARIO e RESPONSAVEL, mas escrever
 * (agendar/editar/cancelar) exige VETERINARIO.
 *
 * `observacoes`/`nomeUnidade` usam `.nullish()`: sem um
 * `@JsonInclude(NON_NULL)` no Spring, um campo vazio chega como `null`, não
 * ausente — visto na prática em consultas antigas sem unidade vinculada.
 */
export const consultaApiResponseSchema = z.object({
  id: z.number(),
  dataHora: z.string(),
  tipo: z.enum(["PRESENCIAL", "TELECONSULTA"]),
  observacoes: z.string().nullish(),
  status: z.enum(["AGENDADA", "REALIZADA", "CANCELADA"]),
  nomePet: z.string(),
  nomeVeterinario: z.string(),
  nomeUnidade: z.string().nullish(),
});

export type ConsultaApiResponse = z.infer<typeof consultaApiResponseSchema>;

export const paginaDeConsultasSchema = z.object({
  content: z.array(consultaApiResponseSchema),
});
