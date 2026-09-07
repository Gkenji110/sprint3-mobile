import * as z from "zod";

export const ESPECIES = ["Cachorro", "Gato", "Pássaro", "Outro"] as const;
export type Especie = (typeof ESPECIES)[number];

export const SEXOS = ["Macho", "Fêmea"] as const;
export type Sexo = (typeof SEXOS)[number];

export const PetSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório").trim(),
  especie: z.enum(ESPECIES, { message: "Selecione uma espécie" }),
  raca: z.string().min(1, "Raça obrigatória").trim(),
  peso: z.string().min(1, "Peso obrigatório").trim(),
  sexo: z.enum(SEXOS, { message: "Selecione o sexo" }),
});

export type PetInput = z.infer<typeof PetSchema>;