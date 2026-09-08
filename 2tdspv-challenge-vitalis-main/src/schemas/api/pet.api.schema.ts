import { z } from "zod";

/**
 * Pet como o `pethub-java` devolve em `GET /api/pets`.
 *
 * `especie` e `genero` são texto livre no backend (ex.: "Cão"), não o enum
 * fixo que o formulário local usa ("Cachorro") — a API é quem manda no valor
 * exibido; o enum continua existindo só para quem preenche o formulário.
 */
export const petApiResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  especie: z.string(),
  raca: z.string().optional(),
  idade: z.number().optional(),
  peso: z.number().optional(),
  genero: z.string().optional(),
  nomeResponsavel: z.string().optional(),
  nomeVeterinarioResponsavel: z.string().optional(),
});

export type PetApiResponse = z.infer<typeof petApiResponseSchema>;

export const paginaDePetsSchema = z.object({
  content: z.array(petApiResponseSchema),
});
