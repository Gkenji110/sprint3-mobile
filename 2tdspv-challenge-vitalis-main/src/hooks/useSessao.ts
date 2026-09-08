import { useAuth } from "@/context/AuthContext";

/**
 * Abrir e fechar sessão, dos dois lados.
 *
 * Existem como hooks à parte — e não `useAuth().entrar`/`sair` direto — para
 * que login, cadastro e a tela de Perfil compartilhem o mesmo nome de
 * conceito, mesmo que hoje sejam um repasse simples para o `AuthContext`.
 */
export function useIniciarSessao() {
  const { entrar } = useAuth();
  return entrar;
}

export function useEncerrarSessao() {
  const { sair } = useAuth();
  return sair;
}
