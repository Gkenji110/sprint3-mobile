# Script do Vídeo Demo — PetHub (Sprint 3)

Duração alvo: ajuste conforme o limite do enunciado (normalmente 5-8 min). Cada bloco abaixo indica **o que mostrar no emulador**, **o que falar** e, quando fizer sentido, **qual trecho de código mostrar** (editor ao lado ou em tela cheia rápida).

---

## 0. Abertura (10-15s)

**Falar:** nome do projeto (PetHub by Vitalis), nome do(s) integrante(s)/RM, e uma frase do problema que resolve: plataforma de teleconsulta e acompanhamento de saúde pet, com dois perfis de uso — tutor e veterinário.

**Mostrar:** tela de login já aberta no emulador (não precisa gravar o boot do Expo).

---

## 1. Autenticação e cadastro (30-40s)

**Ações no emulador:**
1. Na tela de login (`login.tsx`), mostrar os campos e o botão "Entrar".
2. Ir para cadastro de tutor (`cadastro.tsx`) — mostrar o formulário rapidamente.
3. Logar como tutor (usar um usuário já existente pra não perder tempo com cadastro real).

**Falar:** o app tem cadastro separado para tutor (`cadastro.tsx`) e veterinário (`cadastro-veterinario.tsx`), mas é um único app com roteamento por perfil — não dois apps.

**Código (opcional, rápido):** `useLoginMutation.ts` e `useCadastroMutation.ts` — mostrar o `useMutation` com `onSuccess`/`onError` já padronizado.

---

## 2. Fluxo do Tutor

### 2.1 Dashboard (10-15s)
**Mostrar:** `(tabs)/dashboard.tsx` — visão geral do tutor.

### 2.2 Pets (30-40s)
**Ações:**
1. Abrir aba "Pets" (`(tabs)/pets.tsx`) — lista de pets cadastrados.
2. Abrir detalhes de um pet (`pet-details.tsx`).
3. Voltar e mostrar cadastro/edição — se o fluxo de add pet pelo tutor existir aqui, ou mencionar que cadastro de pet é feito pelo veterinário (`add-pet-vet.tsx`).

**Falar:** os dados vêm de verdade da API (.NET) — não é mock; toda tela de pets consome `usePets()`.

**Código (rápido):** `usePets.ts` — mostrar `queryKey: petsQueryKey` (a constante exportada) e comentar que ela é reaproveitada pelas mutations de criar/editar/excluir pet, evitando string duplicada.

### 2.3 Lembretes (20-30s)
**Ações:**
1. Abrir `add-lembrete.tsx`, preencher e salvar um lembrete.
2. Editar (`edit-lembrete.tsx`) e excluir um lembrete.

**Falar:** cada uma dessas ações dispara uma mutation (`useCriarLembreteMutation`, `useEditarLembreteMutation`, `useExcluirLembreteMutation`) que invalida a query de lembretes automaticamente.

**Código (rápido):** abrir `useCriarLembreteMutation.ts` e mostrar o bloco:
```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: lembretesQueryKey });
},
onError: (error) => {
  console.error(error);
},
```
Comentar: esse é o padrão replicado nos 18 hooks de mutation do projeto.

### 2.4 Sintomas → Sugestão (30-40s)
**Ações:**
1. Abrir `sintomas.tsx`, selecionar um pet, marcar sintomas (ex: "Dificuldade para respirar" + duração "Mais de 7 dias").
2. Avançar para `sugestao-ia.tsx` e mostrar o resultado classificado como "Atendimento Urgente".
3. Repetir rapidamente (ou só falar) o caso de sintoma leve → "observação".

**Falar com cuidado aqui:** hoje essa triagem roda com uma regra local no app (`getUrgencia`, em `sugestao-ia.tsx`), não com o pipeline de IA real (Google STT + GenAI do Flask) — isso ainda está no roadmap de integração, então no vídeo é importante deixar claro que essa tela representa a experiência final esperada, com a lógica de classificação simulada localmente até a integração com o serviço de IA ser conectada.

**Código (rápido):** mostrar a função `getUrgencia()` em `sugestao-ia.tsx`.

### 2.5 Consultas / Calendário / Teleconsulta (30-40s)
**Ações:**
1. Abrir `(tabs)/consultas.tsx` — lista de consultas do tutor.
2. Abrir `(tabs)/calendario.tsx` — visão de agenda.
3. Entrar em `teleconsulta.tsx` a partir de uma consulta, mostrar os controles (iniciar chamada, mic, câmera).

**Falar:** a tela de teleconsulta representa a interface da chamada; a chamada de vídeo em si depende da integração real (WebRTC/serviço externo), que também está fora do escopo mobile desta sprint — aqui o foco é o fluxo de navegação e estado da consulta.

### 2.6 Perfil do tutor (20-30s)
**Ações:**
1. Abrir `(tabs)/perfil.tsx`.
2. Clicar em editar, mudar um dado, salvar — mostrar o `Alert.alert` de confirmação.
3. (Opcional) Mostrar o fluxo de excluir perfil, sem confirmar de verdade — só até o Alert de confirmação, depois cancelar.

**Falar:** toda ação destrutiva ou de salvar passa por confirmação via `Alert.alert` antes de chamar a mutation — outro padrão consistente no projeto.

---

## 3. Fluxo do Veterinário (30-40s intro + telas)

**Ações:**
1. Sair da conta de tutor (`handleSair`) e logar como veterinário.
2. Mostrar `(vet)/pacientes.tsx` — lista de pets sob cuidado do veterinário.
3. Mostrar `(vet)/consultas.tsx`, abrir `add-consulta-vet.tsx` (agendar) e `edit-consulta-vet.tsx` (editar uma existente).
4. Mostrar `(vet)/vacinas.tsx`, abrir `add-vacina-tratamento-vet.tsx` e `edit-vacina-tratamento-vet.tsx`.
5. Mostrar `(vet)/perfil.tsx`.

**Falar:** mesmo app, roteamento condicional por perfil de sessão — reforça o ponto de "app único" que corrige a descrição antiga de "dual app" no pitch.

**Código (rápido, o destaque da correção mais recente):** abrir `edit-consulta-vet.tsx`, mostrar o bloco:
```tsx
{/* Estado da mutation */}
{isError && (
  <Text className="text-red-500 text-center font-body">{error.message}</Text>
)}
```
**Falar:** até pouco tempo atrás essa tela também deixava uma mensagem de sucesso fixa na tela depois de salvar; foi padronizada para seguir o mesmo comportamento das telas de perfil — a confirmação antes de salvar (`Alert.alert`) já avisa o usuário, e só o erro fica visível, evitando mensagem "presa" e desatualizada na tela.

---

## 4. Qualidade de código (60-90s) — a parte "por baixo do capô"

Esse bloco pode ser gravado com tela dividida (emulador pequeno + editor) ou só editor, sem precisar interagir com o app.

1. **Padrão de mutation consistente** — abrir 2 hooks diferentes lado a lado (ex: `useCriarPetMutation.ts` e `useExcluirVeterinarioMutation.ts`) e mostrar que todos seguem a mesma forma: `mutationFn`, `onSuccess` (invalida a query certa), `onError` (`console.error`).
2. **Chaves de query centralizadas** — abrir `useVacinasTratamentos.ts`, mostrar:
   ```ts
   export const vacinasTratamentosQueryKey = ["vacinas-tratamentos"] as const;
   ```
   e depois `useExcluirVacinaTratamentoMutation.ts` importando e reaproveitando essa constante em vez de repetir a string — elimina risco de erro de digitação entre a query e a invalidação.
3. **Ordem padronizada dos componentes** — abrir qualquer tela (ex: `(tabs)/perfil.tsx`) e apontar visualmente a estrutura: primeiro todos os `const` (hooks, estado), depois as funções de handler, depois returns antecipados de loading/erro, e só no final o `return` do JSX — o mesmo template usado nos projetos de referência da disciplina.

**Falar:** esse alinhamento de padrão foi um processo deliberado de revisão comparando o projeto com os exercícios de referência do curso (cache-invalidation, authlab, paceup), e ajustado nos últimos 3 commits do repositório.

---

## 5. Fechamento (15-20s)

**Falar:**
- Resumo de uma frase: app único, dois perfis, dados reais via API .NET, com pontos de integração já desenhados para IA (Flask) e notificações (Java/n8n/WhatsApp) nas próximas etapas.
- Agradecimento/encerramento.

**Mostrar:** voltar para o dashboard ou tela inicial como imagem final.

---

## Checklist rápido antes de gravar

- [ ] Emulador com um usuário tutor e um veterinário já cadastrados (evita perder tempo cadastrando ao vivo)
- [ ] Pelo menos 1 pet, 1 lembrete, 1 consulta e 1 vacina/tratamento já existentes para não depender de digitação ao vivo
- [ ] Backend .NET/Java rodando e acessível antes de começar a gravação (testar uma tela antes de apertar "gravar")
- [ ] Editor de código já aberto nos arquivos que serão mostrados, evitando navegar em tempo real
- [ ] Decidir se vai narrar ao vivo ou gravar tela muda e narrar depois
