# PetHub 🐾

Aplicativo mobile para acompanhamento contínuo da saúde do pet.

## Sobre o Projeto

O **PetHub** nasceu de uma necessidade real do mercado pet brasileiro: a descontinuidade no cuidado preventivo dos animais. Tutores costumam acionar clínicas veterinárias apenas em situações de urgência ou em gatilhos óbvios como vacinação, deixando de lado consultas preventivas, check-ups e acompanhamento contínuo da saúde do pet.

O PetHub resolve esse problema oferecendo uma plataforma mobile completa que acompanha a jornada de saúde do pet ao longo de toda a sua vida. Com lembretes inteligentes, triagem de sintomas por IA, controle de vacinas e teleconsulta, o aplicativo coloca o cuidado preventivo no centro da rotina do tutor — e não apenas nas emergências.

A solução foi desenvolvida como resposta ao desafio proposto pela **CLYVO VET** no **FIAP Challenge 2026**, com o objetivo de construir o sistema operacional do relacionamento contínuo entre clínica, responsável e pet.

## Funcionalidades

### Autenticação
- Onboarding apresentando o app na primeira abertura
- Cadastro de conta com nome, email e senha
- Login com autenticação local via AsyncStorage
- Logout com retorno ao onboarding

### Gestão de Pets
- Cadastro de pets com nome, espécie, raça, peso e sexo
- Listagem de todos os pets cadastrados
- Edição e exclusão de pets
- Tela de detalhes com informações completas do pet

### Controle de Vacinas
- Registro de vacinas separadas por pet
- Informações de data de aplicação, próxima dose e status
- Status: Aplicada, Pendente ou Atrasada
- Histórico completo de vacinas por pet

### Lembretes de Saúde
- Criação de lembretes com título, data, hora e tipo
- Tipos: Vacina, Consulta, Medicamento, Check-up e Outro
- Vinculação de lembrete ao pet correspondente
- Edição e exclusão de lembretes
- Seleção de data e hora via DateTimePicker nativo

### Triagem com IA
- Seleção de sintomas por chips interativos
- Seleção de duração dos sintomas
- Campo de descrição adicional
- Análise automática e classificação em três níveis:
  - Atendimento Urgente
  - Consulta Recomendada
  - Observação em Casa

### Gestão de Consultas
- Agendamento de consultas a partir da triagem de sintomas
- Histórico de consultas com status (Agendada, Concluída, Cancelada)
- Exclusão de consultas com confirmação

### Teleconsulta
- Sala de teleconsulta acessível pelo dashboard e pelas consultas agendadas
- Controles de microfone e câmera
- Informações da consulta em andamento

### Perfil do Responsável
- Cadastro e edição de nome, email e telefone
- Dados sincronizados automaticamente com o cadastro da conta
- Exclusão de perfil
- Atalho para gerenciamento de pets

## Tecnologias

- React Native com Expo
- Expo Router (navegação)
- NativeWind (estilização)
- AsyncStorage (persistência local)
- React Context API (gerenciamento de estado)
- React Hook Form + Zod (formulários e validação)

## Como Rodar

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npx expo start
```

## Telas

- Onboarding
- Login
- Cadastro
- Dashboard
- Pets (lista, detalhes, cadastro, edição)
- Vacinas (por pet)
- Calendário de lembretes
- Consultas
- Relato de Sintomas
- Sugestão da IA
- Teleconsulta
- Perfil do Responsável

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