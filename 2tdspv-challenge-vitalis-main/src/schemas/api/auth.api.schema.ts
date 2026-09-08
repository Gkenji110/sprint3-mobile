import { z } from "zod";

/** Corpo que `POST /api/auth/login` e `POST /api/auth/registrar/responsavel` devolvem. */
export const respostaDeLoginSchema = z.object({
  token: z.string(),
  perfil: z.enum(["RESPONSAVEL", "VETERINARIO"]),
  nome: z.string(),
  id: z.number(),
});

export type RespostaDeLogin = z.infer<typeof respostaDeLoginSchema>;
export type Perfil = RespostaDeLogin["perfil"];
