import { z } from "zod";

/**
 * Lembrete como o `pethub-java` devolve em `GET /api/lembretes`.
 *
 * `tipo` e `status` são enums de verdade no backend (ao contrário de
 * `especie`/`genero` de pet, que são texto livre) — por isso o mobile usa o
 * mesmo conjunto fechado de valores, não um vocabulário próprio.
 */
export const lembreteApiResponseSchema = z.object({
  id: z.number(),
  responsavelId: z.number(),
  nomeResponsavel: z.string(),
  petId: z.number(),
  nomePet: z.string(),
  tipo: z.enum(["VACINA", "CONSULTA", "EXAME", "MEDICAMENTO", "HIDRATACAO"]),
  dataAgendada: z.string(),
  mensagem: z.string(),
  status: z.enum(["PENDENTE", "ENVIADO", "FALHOU"]),
  referenciaId: z.number().optional(),
  referenciaTipo: z.string().optional(),
  createdAt: z.string(),
});

export type LembreteApiResponse = z.infer<typeof lembreteApiResponseSchema>;
export type TipoLembrete = LembreteApiResponse["tipo"];
export type StatusLembrete = LembreteApiResponse["status"];

export const paginaDeLembretesSchema = z.object({
  content: z.array(lembreteApiResponseSchema),
});
