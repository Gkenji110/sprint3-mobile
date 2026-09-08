import * as z from "zod";
import { ESPECIES, SEXOS } from "./pet.schema";

export { ESPECIES, SEXOS };

/**
 * Formulário de cadastro/edição de pet, usado pelo veterinário.
 *
 * `idade` e `peso` chegam como texto do `TextInput` e são convertidos pra
 * número só na hora de montar o corpo da requisição — dá pra deixar os dois
 * em branco, já que `PetRequest` não os exige.
 */
export const PetVeterinarioSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório").trim(),
  especie: z.enum(ESPECIES, { message: "Selecione uma espécie" }),
  raca: z.string().trim().optional(),
  idade: z.string().trim().optional(),
  peso: z.string().trim().optional(),
  genero: z.enum(SEXOS, { message: "Selecione o gênero" }).optional(),
  // O backend exige exatamente 11 dígitos, sem pontuação — mesma regra do CPF de cadastro.
  responsavelCpf: z.string().trim().regex(/^\d{11}$/, "CPF deve ter 11 dígitos, sem pontos ou traços"),
});

export type PetVeterinarioInput = z.infer<typeof PetVeterinarioSchema>;
