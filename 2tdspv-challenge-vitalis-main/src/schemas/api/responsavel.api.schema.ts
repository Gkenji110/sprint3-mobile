import { z } from "zod";

/**
 * Responsável (tutor) como o `pethub-java` devolve em `GET /api/responsaveis/{id}`.
 *
 * `telefone` não existe aqui — mora no sub-recurso `/api/responsaveis/{id}/contatos`,
 * fora do escopo deste app por enquanto.
 */
export const responsavelApiResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string(),
  email: z.string(),
  ativo: z.boolean(),
  createdAt: z.string(),
});

export type ResponsavelApiResponse = z.infer<typeof responsavelApiResponseSchema>;
