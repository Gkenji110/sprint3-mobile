/**
 * Emoji pra representar a espécie de um pet.
 *
 * A API manda texto livre (ex.: "Cão"), diferente do enum fixo do formulário
 * local ("Cachorro") — por isso compara por trecho, sem exigir o valor exato.
 * Qualquer coisa não reconhecida cai na pata genérica, nunca quebra a tela.
 */
export function iconeDaEspecie(especie?: string): string {
  const normalizada = especie?.toLowerCase() ?? "";
  if (normalizada.includes("cão") || normalizada.includes("cachorro")) return "🐶";
  if (normalizada.includes("gato")) return "🐱";
  if (normalizada.includes("pássaro") || normalizada.includes("ave")) return "🐦";
  return "🐾";
}
