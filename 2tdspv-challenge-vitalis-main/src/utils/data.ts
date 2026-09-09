/** Formata uma `Date` como `yyyy-MM-dd` (formato que `LocalDate` do Java espera). */
export function paraDataIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Formata uma data `yyyy-MM-dd` da API para exibição em pt-BR. */
export function paraDataBr(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata uma `Date` como `yyyy-MM-ddTHH:mm:ss` (formato que `LocalDateTime`
 * do Java espera, ex.: em `ConsultaRequest.dataHora`).
 */
export function paraDataHoraIso(data: Date): string {
  const dataParte = paraDataIso(data);
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const segundo = String(data.getSeconds()).padStart(2, "0");
  return `${dataParte}T${hora}:${minuto}:${segundo}`;
}
