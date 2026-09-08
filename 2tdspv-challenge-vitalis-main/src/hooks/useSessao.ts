import { useAuth } from "@/context/AuthContext";
import { useResponsavel } from "@/context/ResponsavelContext";
import { Sessao } from "@/services/auth.service";
import { useCallback } from "react";

/**
 * Abrir e fechar sessão, dos dois lados.
 *
 * Login e cadastro terminam do mesmo jeito — o backend devolve o mesmo corpo
 * nos dois —, então o que fazer com a identidade recém-aceita mora aqui, e não
 * duplicado em cada hook de mutação.
 */
export function useIniciarSessao() {
  const { entrar } = useAuth();
  const { responsavel, updateResponsavel } = useResponsavel();

  return useCallback(
    async (sessaoBase: Sessao) => {
      await entrar(sessaoBase);
      await updateResponsavel({
        nome: sessaoBase.nome,
        email: sessaoBase.email,
        telefone: responsavel?.telefone ?? "",
      });
    },
    [entrar, responsavel?.telefone, updateResponsavel],
  );
}

/** Encerrar a sessão precisa levar junto o que era exibido sobre o usuário. */
export function useEncerrarSessao() {
  const { sair } = useAuth();
  const { clearResponsavel } = useResponsavel();

  return useCallback(async () => {
    await sair();
    await clearResponsavel();
  }, [clearResponsavel, sair]);
}
