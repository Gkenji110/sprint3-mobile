# Autenticação real contra o backend Java — design

**Fatia:** login e cadastro. A troca dos demais Contexts por API vem depois.
**Data:** 06/09/2026 · **Sprint 3**, disciplina Mobile Application Development.

---

## 1. Problema

O app autentica contra si mesmo. `AuthContext.tsx` grava `{nome, email, senha}` em texto puro
no AsyncStorage e o login é uma comparação de strings:

```ts
if (usuario.email === email && usuario.senha === senha) { ... }
```

A rubrica classifica isso como autenticação fictícia — penalidade VIII, **-20**. Ela também
exige, nos 20 pontos de autenticação, que as telas protegidas sejam inacessíveis "inclusive por
navegação direta". Hoje `src/app/_layout.tsx` declara todas as telas como irmãs no mesmo
`Stack`, sem nenhum guard: `/dashboard` e `/add-pet` abrem sem login.

Não há camada de rede alguma no app. `grep -rn "fetch(\|axios" src/` não retorna nada, e não
existem as pastas `services/` nem `hooks/`.

## 2. O que já está pronto do outro lado

`pethub-java` **já resolveu** a autenticação e a autorização. Nada precisa ser escrito lá.
Verificado contra a instância em execução em `localhost:8080`:

| Chamada | Resposta observada |
|---|---|
| `POST /api/auth/login` com credencial válida | `200` `{token, perfil, nome, id}` |
| `POST /api/auth/login` com credencial inválida | `401` `{"status":401,"message":"Credenciais inválidas"}` |
| `GET /api/pets` sem token | `401` `{"status":401,"message":"Autenticação necessária"}` |
| `GET /api/pets` com token de tutor | `200`, página contendo **apenas os pets daquele tutor** |
| `POST /api/pets` com token de tutor | `403` `{"status":403,"message":"Seu perfil não tem permissão para esta operação"}` |

O token é um JWT HS384 válido por 8 horas, com o perfil no claim `perfil`.

### CORS — corrigido no backend durante esta fatia

O `WebConfig` liberava `/api/**` para qualquer origem, mas o `SecurityConfig` não habilitava
CORS no filter chain. Como o filtro de segurança roda **antes** do MVC, o preflight do
navegador — que chega sem token, por definição — era rejeitado antes de alcançar aquelas regras:

| Preflight | Antes | Depois |
|---|---|---|
| `OPTIONS /api/auth/login` | 200 (rota `permitAll`) | 200 |
| `OPTIONS /api/pets` | **401** | **200** |

O login funcionava porque `/api/auth/**` é `permitAll`; toda chamada autenticada, não. A
correção é `.cors(Customizer.withDefaults())` no `SecurityConfig`, que faz o Spring Security
delegar às regras já declaradas no `WebConfig`. Não afeta o Android, cujo `fetch` nativo não faz
preflight — só a web.

**Isto define a responsabilidade desta fatia.** Quem garante que o tutor só enxerga o que é
dele é o `EscopoDoUsuario` do backend — por posse do recurso e por chave de cache separada por
dono. O app não replica essa regra e não deve tentar: ele precisa **mandar o token** para o
backend conseguir aplicá-la, e **não oferecer** o que voltaria 403.

A distinção entre 401 e 403 é deliberada no `SecurityConfig` e o app honra: 401 significa
"faça login", 403 significa "seu perfil não permite". São reações diferentes.

## 3. Decisões

**TanStack Query desde já.** O login é a primeira `useMutation` natural do app. O `isPending`
dela é exatamente o estado de carregamento que a rubrica pede (10 pts) e evita a penalidade VI,
que lista `useState` manual após requisição como integração simulada. Instalar agora deixa a
fundação pronta para os 35 pontos de integração da próxima fatia.

**Só o perfil `RESPONSAVEL` entra.** O app é a interface do tutor. Se o login devolver
`perfil: "VETERINARIO"`, a sessão é recusada com mensagem clara em vez de abrir uma UI que não é
daquele usuário e cujos botões só produziriam 403.

**Token no AsyncStorage, não no `expo-secure-store`.** O SecureStore não funciona na web, e a
web é o ambiente de desenvolvimento escolhido. Trocar quebraria justamente onde se desenvolve.

**Firebase Auth foi descartado.** A rubrica aceita, mas criaria duas identidades: o
`EscopoDoUsuario` do Java depende do JWT emitido pelo próprio backend. Ou o Java passaria a
validar token do Firebase, ou o escopo por posse deixaria de funcionar.

## 4. Arquitetura

A regra que organiza tudo: **tela nunca chama `fetch`.** É o que o item 4 da rubrica cobra e o
que evita a penalidade IX (-30, "lógica toda na tela").

```
tela  →  hook (TanStack Query)  →  serviço (caso de uso)  →  cliente HTTP
```

| Arquivo | Camada | Responsabilidade | Depende de |
|---|---|---|---|
| `src/services/api.ts` | transporte | URL base, cabeçalhos, `Bearer`, traduz erro do backend | nada do app |
| `src/services/auth.service.ts` | caso de uso | `autenticarComoTutor()` — autentica e recusa perfil errado | `api.ts` |
| `src/hooks/useLogin.ts` | adaptador React | `useMutation` + grava a sessão no sucesso | serviço + contexto |
| `src/context/AuthContext.tsx` | sessão | token e usuário atuais, persistidos | AsyncStorage |
| `src/app/_layout.tsx` | navegação | `QueryClientProvider` + guard de rota | contexto |
| `src/app/login.tsx` | UI | formulário, carregamento, mensagem de erro | hook |

Cada unidade responde as três perguntas isoladamente: `api.ts` fala HTTP e não sabe o que é
login; `auth.service.ts` sabe o que é login e não sabe o que é React; o hook liga um ao outro;
a tela só desenha.

### 4.1 Cliente HTTP — `src/services/api.ts`

Resolve a URL base assim, nesta ordem:

1. `process.env.EXPO_PUBLIC_API_URL`, se definida — escapatória para qualquer ambiente
2. `http://10.0.2.2:8080` no Android — é como o emulador do Android Studio enxerga o
   `localhost` da máquina hospedeira
3. `http://localhost:8080` no resto — web e iOS

Isso cobre os dois ambientes reais do projeto (desenvolvimento na web, apresentação no emulador
do Android Studio) sem editar código entre um e outro.

Expõe `ErroDaApi`, com `status` e a mensagem que o backend mandou. Todo erro de resposta vira
essa classe, para que as camadas de cima não precisem inspecionar `Response`. O corpo de erro é
sempre `{status, message}` — tanto o `GlobalExceptionHandler` quanto o `SecurityConfig` do Java
escrevem nesse formato.

### 4.2 Caso de uso — `src/services/auth.service.ts`

`autenticarComoTutor(credenciais)` chama `POST /api/auth/login`, e recusa a sessão se o perfil
devolvido não for `RESPONSAVEL`. A regra vive aqui, e não na tela nem no hook, porque é regra de
negócio: *este app é do tutor*.

### 4.3 Sessão — `src/context/AuthContext.tsx`

Reescrito. Passa a guardar `{token, id, nome, email, perfil}` sob a chave `sessao`, mais um
booleano `carregando` enquanto lê o AsyncStorage no mount. O `email` vem do que foi digitado no
formulário — o `LoginResponse` do backend devolve só `{token, perfil, nome, id}` — e existe
apenas para a tela de perfil ter o que exibir.

O `carregando` não é detalhe: sem ele o app renderiza um frame como deslogado antes de
descobrir que há token salvo, e o guard chuta o usuário para o login toda vez que o app abre.

`sair()` limpa o armazenamento e o cache do Query. Sem limpar o cache, os dados do usuário
anterior continuariam visíveis para o próximo — o que anularia o escopo que o backend aplica.

### 4.4 Guard de rota — `src/app/_layout.tsx`

Padrão canônico do Expo Router: `useSegments()` para saber a rota atual e `router.replace()`
num efeito. Fica **num lugar só** e cobre toda rota existente e futura, inclusive as telas soltas
fora das abas — hoje `/add-pet` e `/teleconsulta` abrem sem login.

Rotas públicas: `index` (onboarding), `login`, `cadastro`. As demais exigem sessão.

- não autenticado em rota privada → `/login`
- autenticado em rota pública → `/dashboard`

A segunda regra é o que faz a sessão persistir de verdade: reabrir o app com token válido cai
direto no dashboard, sem passar pelo login. A rubrica pede isso explicitamente.

### 4.5 Tela de login — `src/app/login.tsx`

Troca `useAuth().login` por `useLogin()`. O botão desabilita e mostra `ActivityIndicator`
enquanto `isPending`. O erro vira `Alert` com a mensagem que veio do backend.

A chamada a `recarregarResponsavel()` sai: o `ResponsavelProvider` já faz isso no próprio mount,
então ali era redundante.

## 5. Configuração

`EXPO_PUBLIC_API_URL` documentada em `.env.example`. **O `.gitignore` atual ignora `.env*.local`
mas não `.env`** — precisa passar a ignorar, senão o padrão do projeto convida a versionar
configuração de ambiente.

## 6. Cadastro

`POST /api/auth/registrar/responsavel` cria o tutor e **já devolve o mesmo corpo do login**, então
cadastrar autentica de uma vez: não há confirmação nem volta para a tela de login, e o
`ControleDeAcesso` leva ao dashboard sozinho. Pedir a senha de novo na tela seguinte seria
cerimônia sem propósito.

O backend exige **CPF de 11 dígitos, sem pontuação** — campo que o formulário não tinha. O
schema Zod valida com `/^\d{11}$/` e o campo usa teclado numérico com `maxLength`, para o
usuário não conseguir digitar o que o servidor vai recusar.

Como login e cadastro terminam igual, o que fazer com a identidade recém-aceita mora em
`useSessao.ts` (`useIniciarSessao` / `useEncerrarSessao`), e não duplicado nos dois hooks de
mutação.

Erros que o backend distingue e a interface repassa:

| Situação | Resposta | O que o usuário lê |
|---|---|---|
| CPF fora do formato | 400 com `errors` por campo | "CPF deve ter 11 dígitos" |
| Email já cadastrado | 409 | "O email … já está cadastrado no sistema" |
| CPF já cadastrado | 409 | "Violação de integridade de dados" |

A mensagem de topo de um 400 é só "Erro de validação", genérica demais para o usuário se
corrigir; por isso `extrairMensagem` prefere as mensagens por campo quando existem.

## 7. O que esta fatia deixa em aberto

**Expiração do token.** Vale 8 horas. O app não decodifica o `exp`; descobre que expirou na
primeira chamada que voltar 401, e aí limpa a sessão. É suficiente e honesto para esta fatia.

**O perfil ainda é preenchido a partir da sessão.** `useIniciarSessao` copia nome e email da
resposta de autenticação para o `ResponsavelContext`, porque o `LoginResponse` não traz telefone
nem endereço. É uma ponte: a fatia de integração troca isso por `GET /api/responsaveis/{id}`,
que agora funciona no navegador graças à correção de CORS.

**Os outros Contexts continuam no AsyncStorage.** Pet, Lembrete, Consulta e Vacina não são
tocados aqui. São a fatia de integração (35 pts), a seguir.

## 8. Verificação

Sem Jest no repositório — não há configuração nem script de teste, só um `react-test-renderer`
solto. Montar `jest-expo` não pontua nesta rubrica e não cabe no prazo de 12/09. A verificação
desta fatia é de ponta a ponta contra o backend real.

Nota: `npx tsc --noEmit` **nunca havia rodado neste repositório** — `"ignoreDeprecations": "6.0"`
é inválido no TypeScript 5.9.3 e abortava a checagem. A linha foi removida; nada precisava ser
suprimido, a checagem passa limpa sem ela.

Automatizado:

1. `npx tsc --noEmit` — zero erros
2. `npx expo export --platform web` — 23 rotas empacotadas, todos os imports resolvem
3. `./mvnw test` no `pethub-java` — 43 testes, zero falhas, após a mudança no `SecurityConfig`
4. Contrato do backend por `curl`: login 200/401, escopo do tutor no `GET`, 403 no `POST`,
   400 com erro por campo e 409 em email duplicado, preflight 200 em rota autenticada

Manual, no navegador:

5. Login com `teste3@email.com` / `teste3` → chega ao dashboard
6. Senha errada → alerta "Credenciais inválidas", permanece no login
7. Cadastro com CPF de 11 dígitos → entra direto, sem passar pelo login
8. Cadastro com email repetido → alerta com a mensagem de conflito do servidor
9. Recarregar a página → continua logado, sem passar pelo login
10. Deslogado, navegar direto para `/dashboard` e `/add-pet` → redirecionado ao login
11. Logout no perfil → volta ao login e a navegação direta volta a ser bloqueada
