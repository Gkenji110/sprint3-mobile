import { requisitar } from "./api";

/**
 * Pet como o `pethub-java` devolve em `GET /api/pets`.
 *
 * `especie` e `genero` são texto livre no backend (ex.: "Cão"), não o enum
 * fixo que o formulário local usa ("Cachorro") — a API é quem manda no valor
 * exibido; o enum continua existindo só para quem preenche o formulário.
 */
export type PetApiResponse = {
  id: number;
  nome: string;
  especie: string;
  raca?: string;
  idade?: number;
  peso?: number;
  genero?: string;
  nomeResponsavel?: string;
  nomeVeterinarioResponsavel?: string;
};

type PaginaDePets = {
  content: PetApiResponse[];
};

/**
 * O backend pagina por padrão (Spring Data). A UI ainda não tem paginação,
 * então pede uma página grande o bastante pra cobrir os pets de um tutor. Se
 * isso um dia não bastar, o certo é construir paginação de verdade — não
 * aumentar esse número.
 */
const TAMANHO_SEM_PAGINACAO_NA_UI = 100;

/** Pets do tutor logado. O backend já filtra pelo token — não há id pra passar. */
export async function listarMeusPets(token: string): Promise<PetApiResponse[]> {
  const pagina = await requisitar<PaginaDePets>(
    `/api/pets?size=${TAMANHO_SEM_PAGINACAO_NA_UI}`,
    { token },
  );
  return pagina.content;
}
