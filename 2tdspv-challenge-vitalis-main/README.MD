# PetHub 🐾

Aplicativo mobile para acompanhamento contínuo da saúde do pet.

## Sobre o Projeto

O **PetHub** nasceu de uma necessidade real do mercado pet brasileiro: a descontinuidade no cuidado preventivo dos animais. Tutores costumam acionar clínicas veterinárias apenas em situações de urgência ou em gatilhos óbvios como vacinação, deixando de lado consultas preventivas, check-ups e acompanhamento contínuo da saúde do pet.

O PetHub resolve esse problema oferecendo uma plataforma mobile completa que acompanha a jornada de saúde do pet ao longo de toda a sua vida. Com lembretes inteligentes, triagem de sintomas por IA, controle de vacinas e teleconsulta, o aplicativo coloca o cuidado preventivo no centro da rotina do tutor — e não apenas nas emergências.

A solução foi desenvolvida como resposta ao desafio proposto pela **CLYVO VET** no **FIAP Challenge 2026**, com o objetivo de construir o sistema operacional do relacionamento contínuo entre clínica, responsável e pet.

Este repositório é o app mobile — a interface do **tutor** (perfil `RESPONSAVEL`). Ele integra com o backend `pethub-java` (Spring Boot), que também atende um futuro portal do veterinário (perfil `VETERINARIO`), fora do escopo deste projeto.

## Funcionalidades

### Autenticação
- Onboarding apresentando o app na primeira abertura
- Cadastro de conta com nome, CPF, email e senha, via `POST /api/auth/registrar/responsavel`
- Login via `POST /api/auth/login`, com token JWT devolvido pelo backend
- Sessão persistida localmente (AsyncStorage) só para não pedir login a cada abertura — quem autentica de fato é a API
- Logout com retorno à tela de login

### Meus Pets (somente leitura)
- Listagem dos pets do tutor, vindos de `GET /api/pets`
- Tela de detalhes com informações completas do pet
- Cadastro, edição e exclusão de pet pertencem ao veterinário: o `SecurityConfig` do backend restringe escrita nesse recurso ao perfil `VETERINARIO` — o app do tutor só consome a leitura

### Controle de Vacinas
- Registro de vacinas por pet, guardado localmente no dispositivo (recurso auxiliar, não integrado ao backend)
- Informações de data de aplicação, próxima dose e status
- Status: Aplicada, Pendente ou Atrasada
- Histórico completo de vacinas por pet

### Lembretes de Saúde (CRUD completo via API)
- Criação, edição e exclusão de lembretes via `POST`/`PUT`/`DELETE /api/lembretes`, listagem via `GET`
- Tipos: Vacina, Consulta, Exame, Medicamento e Hidratação
- Vinculação de lembrete ao pet correspondente
- Seleção de data via `DateTimePicker` nativo

### Triagem com IA
- Seleção de sintomas por chips interativos
- Seleção de duração dos sintomas
- Campo de descrição adicional
- Análise automática e classificação em três níveis:
  - Atendimento Urgente
  - Consulta Recomendada
  - Observação em Casa

### Minhas Consultas (somente leitura)
- Histórico de consultas do tutor, vindo de `GET /api/consultas`
- Agendar, editar ou cancelar consulta é ação exclusiva do veterinário/clínica (`SecurityConfig` do backend) — fora do escopo deste app

### Teleconsulta
- Sala de teleconsulta acessível pelo dashboard e pelas consultas agendadas
- Controles de microfone e câmera
- Informações da consulta em andamento

### Perfil do Responsável (CRUD completo via API)
- Leitura via `GET /api/responsaveis/{id}`, edição via `PUT` e exclusão via `DELETE`
- Edição de nome e email; a API exige a senha em toda atualização, então o formulário sempre pede a senha atual (ou uma nova, caso o tutor queira trocá-la)
- Exclusão de perfil encerra a sessão e retorna ao login
- Atalho para a lista de pets

## Tecnologias

- React Native com Expo
- Expo Router (navegação)
- NativeWind (estilização)
- TanStack Query (cache, sincronização e estado de carregamento/erro das chamadas à API)
- Zod (validação de formulários e das respostas da API)
- React Hook Form (formulários)
- AsyncStorage (persistência da sessão local)
- React Context API (sessão de autenticação)
- Integração REST com o backend `pethub-java` (Spring Boot + JWT + Oracle)

## Como Rodar

```bash
# Instalar dependências
npm install

# Configurar a URL da API (opcional — por padrão usa localhost:8080 /
# 10.0.2.2:8080 no emulador Android)
# EXPO_PUBLIC_API_URL=http://localhost:8080

# Com o backend pethub-java rodando, iniciar o projeto
npx expo start
```

## Telas

- Onboarding
- Login
- Cadastro
- Dashboard
- Pets (lista, detalhes — somente leitura)
- Vacinas (por pet)
- Calendário de lembretes (CRUD completo)
- Consultas (somente leitura)
- Relato de Sintomas
- Sugestão da IA
- Teleconsulta
- Perfil do Responsável (CRUD completo)

## Integrantes

- Ana Flavia Camelo - RM561489
- Gustavo Kenji Terada - RM562745
- João Guilherme Carvalho Novaes - RM566234
- Pedro Chasci Puga - Ram565154
- Lucas Figueiredo Vieira - RM561342

## Vídeo de Demonstração

[Link do YouTube](xxxxxxx)

## Repositório

https://github.com/FIAP-MOBILE-2026-Fevereiro/2tdspv-challenge-vitalis
