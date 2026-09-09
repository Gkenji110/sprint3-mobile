import * as z from "zod";

export const TIPOS_VACINA_TRATAMENTO = ["VACINA", "MEDICAMENTO", "PROCEDIMENTO"] as const;
export type TipoVacinaTratamento = (typeof TIPOS_VACINA_TRATAMENTO)[number];

export const TIPO_VACINA_TRATAMENTO_LABEL: Record<TipoVacinaTratamento, string> = {
  VACINA: "Vacina",
  MEDICAMENTO: "Medicamento",
  PROCEDIMENTO: "Procedimento",
};

/** Formulário de registro (o veterinário escolhe o pet). */
export const VacinaTratamentoRegistrarSchema = z.object({
  petId: z.number({ message: "Selecione um pet" }),
  tipo: z.enum(TIPOS_VACINA_TRATAMENTO, { message: "Selecione um tipo" }),
  nome: z.string().min(1, "Nome obrigatório").trim(),
  dataAplicacao: z.string().min(1, "Data de aplicação obrigatória"),
  proximaDose: z.string().trim().optional(),
  dose: z.string().trim().optional(),
  observacoes: z.string().trim().optional(),
});

export type VacinaTratamentoRegistrarInput = z.infer<typeof VacinaTratamentoRegistrarSchema>;

/** Formulário de edição (o pet já está fixado pelo registro existente). */
export const VacinaTratamentoEditarSchema = VacinaTratamentoRegistrarSchema.omit({ petId: true });

export type VacinaTratamentoEditarInput = z.infer<typeof VacinaTratamentoEditarSchema>;
