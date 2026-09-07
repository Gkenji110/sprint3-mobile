import { Platform } from "react-native";

/**
 * Cliente HTTP do backend Java.
 *
 * Sabe falar HTTP e nada mais: não conhece login, pet nem consulta. Quem dá
 * significado às rotas são os serviços em `src/services`.
 */

const PORTA_DO_BACKEND = 8080;

/** Status sintético para quando a requisição nem chegou a ter resposta. */
const SEM_RESPOSTA = 0;

/**
 * Onde o backend responde.
 *
 * O emulador do Android não enxerga o `localhost` da máquina hospedeira:
 * 10.0.2.2 é o alias que a própria VM expõe para alcançá-la. Na web e no iOS,
 * `localhost` já é o host certo.
 */
function resolverUrlBase(): string {
  const configurada = process.env.EXPO_PUBLIC_API_URL;
  if (configurada) {
    return configurada;
  }
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:${PORTA_DO_BACKEND}`;
}

export const URL_BASE = resolverUrlBase();

/**
 * Falha vinda da API, já traduzida.
 *
 * Carrega o status porque as camadas de cima reagem de forma diferente a cada
 * um: 401 no login é senha errada, 401 fora dele é sessão expirada, e 403 é
 * perfil sem permissão.
 */
export class ErroDaApi extends Error {
  constructor(
    readonly status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroDaApi";
  }

  get ehFalhaDeRede(): boolean {
    return this.status === SEM_RESPOSTA;
  }
}

type Opcoes = {
  metodo?: "GET" | "POST" | "PUT" | "DELETE";
  corpo?: unknown;
  token?: string;
};

export async function requisitar<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = "GET", corpo, token } = opcoes;

  let resposta: Response;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: montarCabecalhos(corpo !== undefined, token),
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDaApi(
      SEM_RESPOSTA,
      `Não foi possível falar com o servidor em ${URL_BASE}. Verifique se o backend está no ar.`,
    );
  }

  if (!resposta.ok) {
    throw new ErroDaApi(resposta.status, await extrairMensagem(resposta));
  }

  return resposta.status === 204 ? (undefined as T) : ((await resposta.json()) as T);
}

function montarCabecalhos(temCorpo: boolean, token?: string): Record<string, string> {
  const cabecalhos: Record<string, string> = { Accept: "application/json" };
  if (temCorpo) {
    cabecalhos["Content-Type"] = "application/json";
  }
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }
  return cabecalhos;
}

type CorpoDeErro = {
  message?: unknown;
  errors?: { field?: unknown; message?: unknown }[];
};

/**
 * O backend erra sempre no mesmo formato — `{status, message}`, tanto no
 * GlobalExceptionHandler quanto no SecurityConfig —, então a mensagem exibida
 * ao usuário é a que o servidor escreveu.
 *
 * Erros de validação vêm com um `errors` por campo, e a mensagem de topo é
 * apenas "Erro de validação". Dizer *qual* campo está errado é a diferença
 * entre o usuário conseguir se corrigir ou não.
 */
async function extrairMensagem(resposta: Response): Promise<string> {
  try {
    const corpo = (await resposta.json()) as CorpoDeErro;

    const porCampo = (corpo.errors ?? [])
      .map((erro) => erro.message)
      .filter((mensagem): mensagem is string => typeof mensagem === "string");
    if (porCampo.length > 0) {
      return porCampo.join("\n");
    }

    if (typeof corpo.message === "string") {
      return corpo.message;
    }
  } catch {
    // Resposta sem corpo JSON: sobra a mensagem genérica abaixo.
  }
  return `O servidor respondeu ${resposta.status}.`;
}
