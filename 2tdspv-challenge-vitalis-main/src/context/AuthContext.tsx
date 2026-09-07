import { Sessao } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  sessao: Sessao | undefined;
  autenticado: boolean;
  /** Verdadeiro enquanto a sessão salva ainda está sendo lida do disco. */
  carregando: boolean;
  entrar: (sessao: Sessao) => Promise<void>;
  sair: () => Promise<void>;
};

const CHAVE_SESSAO = "sessao";

/**
 * Resquícios do login local: guardavam a senha em texto puro e ninguém mais os
 * lê. São apagados na primeira abertura para não sobreviverem à migração.
 */
const CHAVES_LEGADAS = ["usuario", "logado"];

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [sessao, setSessao] = useState<Sessao | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function restaurarSessao() {
      try {
        const salva = await AsyncStorage.getItem(CHAVE_SESSAO);
        if (salva) {
          setSessao(JSON.parse(salva) as Sessao);
        }
        await AsyncStorage.multiRemove(CHAVES_LEGADAS);
      } catch {
        await AsyncStorage.removeItem(CHAVE_SESSAO);
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);

  const entrar = useCallback(async (nova: Sessao) => {
    setSessao(nova);
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(nova));
  }, []);

  const sair = useCallback(async () => {
    setSessao(undefined);
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    // Sem isto, os dados carregados pelo usuário anterior continuariam no cache
    // e apareceriam para o próximo, anulando o escopo que o backend aplica.
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        sessao,
        autenticado: sessao !== undefined,
        carregando,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro de um AuthProvider");
  }
  return context;
};
