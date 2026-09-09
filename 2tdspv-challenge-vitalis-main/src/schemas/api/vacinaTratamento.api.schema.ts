import { z } from "zod";

/**
 * Vacina/tratamento como o `pethub-java` devolve em
 * `GET /api/vacinas-tratamentos`.
 *
 * Só leitura: `SecurityConfig` coloca `/api/vacinas-tratamentos/**` em
 * `ROTAS_CLINICAS`, onde `GET` é liberado para VETERINARIO e RESPONSAVEL,
 * mas escrever (registrar/editar/excluir) exige VETERINARIO.
 *
 * `proximaDose`/`dose`/`observacoes` usam `.nullish()`: sem um
 * `@JsonInclude(NON_NULL)` no Spring, um campo opcional vazio chega como
 * `null`, não ausente (mesmo problema já visto em pet/consulta/veterinario).
 */
export const vacinaTratamentoApiResponseSchema = z.object({
  id: z.number(),
  tipo: z.enum(["VACINA", "MEDICAMENTO", "PROCEDIMENTO"]),
  nome: z.string(),
  dataAplicacao: z.string(),
  proximaDose: z.string().nullish(),
  dose: z.string().nullish(),
  observacoes: z.string().nullish(),
  nomePet: z.string(),
  nomeVeterinario: z.string(),
});

export type VacinaTratamentoApiResponse = z.infer<typeof vacinaTratamentoApiResponseSchema>;

export const paginaDeVacinasTratamentosSchema = z.object({
  content: z.array(vacinaTratamentoApiResponseSchema),
});
