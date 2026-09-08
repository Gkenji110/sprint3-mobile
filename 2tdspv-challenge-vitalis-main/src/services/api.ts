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

/** Base para todo `fetch` contra o `pethub-java`. Cada serviço monta a rota a partir daqui. */
export const URL_BASE = resolverUrlBase();

/**
 * Lê a mensagem de erro que o `pethub-java` devolve (`{status, message}`,
 * tanto no `GlobalExceptionHandler` quanto no `SecurityConfig`), com um
 * texto de reserva para quando a resposta não tiver esse formato.
 */
export async function extrairMensagemDeErro(
  resposta: Response,
  mensagemDeReserva: string,
): Promise<string> {
  try {
    const corpo = await resposta.json();
    if (typeof corpo.message === "string") {
      return corpo.message;
    }
  } catch {
    // Resposta sem corpo JSON: sobra a mensagem de reserva abaixo.
  }
  return mensagemDeReserva;
}
