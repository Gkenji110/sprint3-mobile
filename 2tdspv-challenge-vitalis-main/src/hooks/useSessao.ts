import { useAuth } from "@/context/AuthContext";
import { useResponsavel } from "@/context/ResponsavelContext";
import { Sessao } from "@/services/auth.service";
import { buscarResponsavelPorId } from "@/services/responsavel.service";
import { useCallback } from "react";

/**
 * Abrir e fechar sessão, dos dois lados.
 *
 * Login e cadastro terminam do mesmo jeito — o backend devolve o mesmo corpo
 * nos dois —, então o que fazer com a identidade recém-aceita mora aqui, e não
 * duplicado em cada hook de mutação.
 */

/**
 * O `LoginResponse` não traz CPF. Ele vem de uma segunda chamada autenticada —
 * `GET /api/responsaveis/{id}` — porque `POST /api/pets` exige esse dado, e
 * inflar a resposta de login só por isso acopla autenticação a perfil (ver
 * `docs/plano-integracao-api.md`). O telefone continua vindo do que já estava
 * salvo, como antes: essa fatia não mexe nisso.
 *
 * Se a busca falhar, a sessão abre normalmente — só fica sem CPF, e é o
 * cadastro de pet que trata essa ausência, não o login.
 */
export function useIniciarSessao() {
  const { entrar } = useAuth();
  const { responsavel, updateResponsavel } = useResponsavel();

  return useCallback(
    async (sessaoBase: Sessao) => {
      let cpf: string | undefined;
      try {
        const perfil = await buscarResponsavelPorId(sessaoBase.id, sessaoBase.token);
        cpf = perfil.cpf;
      } catch {
        // Sessão continua válida sem CPF; quem precisa dele reage à ausência.
      }

      await entrar(cpf ? { ...sessaoBase, cpf } : sessaoBase);
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
