import { Platform } from "react-native";

/**
 * Onde o backend responde.
 *
 * O emulador do Android não enxerga o `localhost` da máquina hospedeira:
 * 10.0.2.2 é o alias que a própria VM expõe para alcançá-la. Na web e no iOS,
 * `localhost` já é o host certo.
 */
const PORTA_DO_BACKEND = 8080;

function resolverUrlBase(): string {
  const configurada = process.env.EXPO_PUBLIC_API_URL;
  if (configurada) {
    return configurada;
  }
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:${PORTA_DO_BACKEND}`;
}

const URL_BASE = resolverUrlBase();

type Opcoes = {
  headers?: Record<string, string>;
};

type ConfiguracaoDaRequisicao = Opcoes & {
  metodo?: "GET" | "POST" | "PUT" | "DELETE";
  corpo?: unknown;
};

/**
 * O `pethub-java` erra sempre em `{status, message}`, tanto no
 * `GlobalExceptionHandler` quanto no `SecurityConfig` — lê essa mensagem
 * quando existe, com uma de reserva para quando o corpo não vier nesse formato.
 */
async function lerMensagemDeErro(resposta: Response): Promise<string> {
  try {
    const corpo = await resposta.json();
    if (typeof corpo.message === "string") {
      return corpo.message;
    }
  } catch {
    // Resposta sem corpo JSON: sobra a mensagem de reserva abaixo.
  }
  return `O servidor respondeu ${resposta.status}.`;
}

async function requisitar(
  caminho: string,
  config: ConfiguracaoDaRequisicao = {},
): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(config.headers ?? {}),
  };
  if (config.corpo !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    method: config.metodo ?? "GET",
    headers,
    body: config.corpo === undefined ? undefined : JSON.stringify(config.corpo),
  });

  if (!resposta.ok) {
    throw new Error(await lerMensagemDeErro(resposta));
  }

  if (resposta.status === 204) {
    return undefined;
  }

  return await resposta.json();
}

/**
 * Cliente HTTP do backend Java: sabe falar HTTP e nada mais — não conhece
 * login, pet nem lembrete. Quem dá significado às rotas e valida o formato
 * da resposta são os serviços em `src/services`, com `zod`.
 */
export const apiClient = {
  get(caminho: string, opcoes: Opcoes = {}) {
    return requisitar(caminho, opcoes);
  },

  post(caminho: string, corpo?: unknown, opcoes: Opcoes = {}) {
    return requisitar(caminho, { ...opcoes, metodo: "POST", corpo });
  },

  put(caminho: string, corpo: unknown, opcoes: Opcoes = {}) {
    return requisitar(caminho, { ...opcoes, metodo: "PUT", corpo });
  },

  async delete(caminho: string, opcoes: Opcoes = {}): Promise<void> {
    await requisitar(caminho, { ...opcoes, metodo: "DELETE" });
  },
};
