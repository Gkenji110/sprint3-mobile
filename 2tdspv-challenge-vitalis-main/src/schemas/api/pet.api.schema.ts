import { z } from "zod";

/**
 * Pet como o `pethub-java` devolve em `GET /api/pets`.
 *
 * `especie` e `genero` são texto livre no backend (ex.: "Cão"), não o enum
 * fixo que o formulário local usa ("Cachorro") — a API é quem manda no valor
 * exibido; o enum continua existindo só para quem preenche o formulário.
 *
 * Campos opcionais usam `.nullish()`, não `.optional()`: sem um
 * `@JsonInclude(NON_NULL)` configurado no Spring, um campo vazio chega como
 * `null` no JSON, e `.optional()` sozinho só aceita `undefined` — rejeitaria
 * um pet real sem raça/idade/peso cadastrados.
 */
export const petApiResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  especie: z.string(),
  raca: z.string().nullish(),
  idade: z.number().nullish(),
  peso: z.number().nullish(),
  genero: z.string().nullish(),
  nomeResponsavel: z.string().nullish(),
  nomeVeterinarioResponsavel: z.string().nullish(),
});

export type PetApiResponse = z.infer<typeof petApiResponseSchema>;

export const paginaDePetsSchema = z.object({
  content: z.array(petApiResponseSchema),
});
