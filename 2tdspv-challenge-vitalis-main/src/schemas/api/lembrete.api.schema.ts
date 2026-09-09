import { z } from "zod";

/**
 * Lembrete como o `pethub-java` devolve em `GET /api/lembretes`.
 *
 * `tipo` e `status` são enums de verdade no backend (ao contrário de
 * `especie`/`genero` de pet, que são texto livre) — por isso o mobile usa o
 * mesmo conjunto fechado de valores, não um vocabulário próprio.
 *
 * `referenciaId`/`referenciaTipo` usam `.nullish()`: sem um
 * `@JsonInclude(NON_NULL)` no Spring, um campo vazio chega como `null` no
 * JSON, não ausente, e `.optional()` sozinho rejeitaria isso.
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
  referenciaId: z.number().nullish(),
  referenciaTipo: z.string().nullish(),
  createdAt: z.string(),
});

export type LembreteApiResponse = z.infer<typeof lembreteApiResponseSchema>;
export type TipoLembrete = LembreteApiResponse["tipo"];
export type StatusLembrete = LembreteApiResponse["status"];

export const paginaDeLembretesSchema = z.object({
  content: z.array(lembreteApiResponseSchema),
});
