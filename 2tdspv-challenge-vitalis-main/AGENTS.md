# PetHub Mobile — guia para agentes

App React Native + Expo do PetHub. Interface do tutor: perfil, pets, vacinas, lembretes,
triagem de sintomas por IA, consultas e teleconsulta.

Deve consumir **duas APIs**: `pethub-java` (pets, consultas, exames, diagnósticos, vacinas,
wearable) e `Vitalis` em .NET (login, responsáveis, endereços, contatos, lembretes). Hoje não
consome nenhuma — ver §"Estado real" abaixo, é o ponto mais importante deste arquivo.

---

## Stack

React Native 0.81 + Expo SDK 54, TypeScript, **Expo Router** (não React Navigation puro — a
dependência `@react-navigation/native` está no `package.json` só como peer dependency do Expo
Router, não use a API dela diretamente), NativeWind (Tailwind), React Hook Form + Zod,
AsyncStorage.

**Sem TanStack Query.** Não está no `package.json`. A rubrica da Sprint 3 exige
`useQuery`/`useMutation` explicitamente — precisa ser adicionado.

## Comandos

```bash
npm install
npx expo start          # abre o Metro; escaneie o QR ou pressione a/i/w
npx expo start --android
npx expo start --ios
npx expo start --web
```

Alias de import: `@/` aponta para `src/` (configurado em `tsconfig.json`).

## Arquitetura

```
src/app/            rotas do Expo Router (cada arquivo = uma tela)
  (tabs)/           as 5 abas: dashboard, pets, calendario, consultas, perfil
src/components/     PetCard, ConsultaCard, LembreteCard, VacinaCard, MyTextInput
src/context/        um Context por domínio (Auth, Pet, Lembrete, Consulta, Responsavel, Vacina)
src/schemas/        um schema Zod por domínio, com o tipo inferido (`z.infer`)
```

Onze telas via Expo Router: onboarding, login, cadastro, dashboard, pets (lista/detalhes/criar/
editar), vacinas, calendário, lembretes (criar/editar), consultas, sintomas, sugestão da IA,
teleconsulta, perfil.

### Convenções já estabelecidas — siga o padrão

- **Um Context por domínio**, sempre com o mesmo formato: `useState` + dois `useEffect`
  (carrega do AsyncStorage no mount, salva a cada mudança) + hook `use<Dominio>()` que lança se
  usado fora do Provider. Veja `PetContext.tsx` como referência.
- **Um schema Zod por domínio** em `src/schemas/`, exportando o schema e o tipo inferido
  (`export type PetInput = z.infer<typeof PetSchema>`).
- Formulários usam **React Hook Form + `@hookform/resolvers/zod`**.
- Providers empilhados em `src/app/_layout.tsx` — qualquer Context novo entra nesse aninhamento.

---

## Estado real (verificado no código, não no README)

Este app foi construído no challenge do **semestre passado**, cuja rubrica não exigia
integração com backend — daí **a aplicação inteira rodar contra AsyncStorage**. `grep -r
"fetch(\|axios"` em `src/` não retorna nada. Não é falha de execução, é o ponto de partida:
agora ele precisa evoluir para atender à rubrica desta sprint, que exige API real.

Checklist completo da disciplina em `../docs/sprint-3/07-mobile.md`. Os três pontos que
precisam de trabalho para esta sprint, com a penalidade exata que cada um evita:

### 1. Integração com API ainda não existe (35 pontos em jogo, mais penalidade)

Todo domínio (`PetContext`, `LembreteContext`, `ConsultaContext`, `ResponsavelContext`,
`VacinaContext`) persiste só em `AsyncStorage`. Não existe pasta `services/` nem `api/`, não há
`fetch` nem `axios` em lugar nenhum do código.

Sem isso, o app não pontua os 35 pontos de integração e se encaixa na penalidade VI da rubrica
("dados substituídos por valores mockados", -20). É a maior peça de trabalho pendente.

**Caminho de menor atrito**: adicionar `@tanstack/react-query`, criar `src/services/` com um
cliente HTTP por domínio, e trocar cada Context para buscar da API em vez do AsyncStorage —
mantendo a mesma interface pública dos hooks (`usePet()`, `useLembrete()` etc.), para não ter
que reescrever as telas. `pethub-java` já tem CRUD completo de pets e consultas, é o ponto de
partida óbvio.

### 2. Autenticação ainda é local (penalidade VIII, -20, se não evoluir)

`AuthContext.tsx`: cadastro grava `{ nome, email, senha }` em texto puro no AsyncStorage; login
compara strings (`usuario.email === email && usuario.senha === senha`); sessão é a flag
`"logado" = "true"` salva no storage. Suporta **um único usuário por instalação** — cadastrar de
novo sobrescreve o anterior.

A rubrica desta sprint exige "autenticação real via serviço externo" e classifica
explicitamente sessão como essa como simulada. Era suficiente para o challenge passado; agora
precisa virar chamada real: Firebase Auth, ou login contra `pethub-java`/`Vitalis`.

### 3. Proteção de rota ainda falta (parte dos 4 pontos de "Proteção de rotas")

`src/app/_layout.tsx` declara todas as telas como irmãs no mesmo `Stack`, sem nenhum guard.
Não há `Redirect` nem verificação de `logado` antes de renderizar `(tabs)` — na prática, dá para
navegar direto para qualquer tela interna sem ter feito login.

### O que já está correto e não precisa mexer

- **Navegação**: Expo Router sozinho, sem mistura com React Navigation manual, rotas
  explícitas — os 5 pontos dessa seção estão cobertos.
- **Histórico de commits**: 44 commits, evolução gradual por feature, mensagens descritivas.
  A penalidade V (-50, histórico artificial) não é risco hoje — **continue assim**: commits
  pequenos e frequentes, nunca um dump grande no fim.
- CRUD local de pets, lembretes e vacinas já funciona de ponta a ponta com validação Zod —
  boa base para trocar o backing store de AsyncStorage para API sem reescrever a UI.

---

## Cuidados

- **Não faça commit nem push sem o usuário pedir** — mas quando fizer, mantenha o padrão de
  commits pequenos e frequentes que o repositório já tem.
- Nenhuma chave de API nem credencial em arquivo versionado.
- A entrega é pelo **GitHub Classroom** — confirme que é esse o remoto antes de considerar
  qualquer coisa "entregue" (-20 se for por outro caminho).
- Ao integrar com a API, reveja `../pethub-java/AGENTS.md` e `../Vitalis/AGENTS.md` para saber
  o contrato de cada endpoint e o estado de autenticação Spring Security do lado Java.
