import { z } from "zod";

/**
 * Unidade veterinária como o `pethub-java` devolve em `GET /api/unidades`.
 *
 * Só é usada aqui pra alimentar o seletor de unidade ao agendar uma
 * consulta — o app não cadastra unidade, isso é administrativo e fica fora
 * do escopo do projeto.
 */
export const unidadeApiResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  nomesVeterinarios: z.array(z.string()).nullish(),
  logradouro: z.string().nullish(),
  numero: z.string().nullish(),
  bairro: z.string().nullish(),
  cidade: z.string().nullish(),
  estado: z.string().nullish(),
  cep: z.string().nullish(),
});

export type UnidadeApiResponse = z.infer<typeof unidadeApiResponseSchema>;

export const paginaDeUnidadesSchema = z.object({
  content: z.array(unidadeApiResponseSchema),
});
