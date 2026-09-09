import { z } from "zod";

/**
 * Veterinário como o `pethub-java` devolve em `GET /api/veterinarios/{id}`.
 *
 * `especialidade`/`telefone`/`nomeUnidade` usam `.nullish()`, não
 * `.optional()`: sem um `@JsonInclude(NON_NULL)` configurado no Spring, um
 * campo vazio chega como `null` no JSON — foi o que quebrava a tela de
 * Perfil do veterinário sem especialidade cadastrada.
 */
export const veterinarioApiResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  crmv: z.string(),
  especialidade: z.string().nullish(),
  email: z.string(),
  telefone: z.string().nullish(),
  ativo: z.boolean(),
  nomeUnidade: z.string().nullish(),
});

export type VeterinarioApiResponse = z.infer<typeof veterinarioApiResponseSchema>;
