# Discussions App

## Introdução

Este projeto é um aplicativo multiplataforma de discussões (ou fóruns) desenvolvido com React Native. Ele é projetado com uma arquitetura clara e incorpora várias funcionalidades essenciais. O propósito é fornecer um modelo para funcionalidades típicas de aplicativos mobile, como autenticação, CRUDs, scroll infinito, entre outros.

## Arquitetura

### Camada de Interface (UI Layer)

- **Elementos visuais (React)**: O papel da IU é mostrar os dados do app na tela e atuar como o ponto principal de interação do usuário. Nessa aplicação, o React é o responsável pela renderização e interatividade.

- **Estado (React Query)**: O estado da aplicação é gerenciado usando o React Query, que oferece um gerenciamento de estado assíncrono eficiente.

### Camada de Dados (Data Layer)

- **Repositórios**: Os repositórios são responsáveis por fornecer uma camada de abstração entre a camada de dados e a camada de interface do usuário. Eles interagem com as fontes de dados (data sources) para buscar e salvar informações.

- **Fontes de dados (API, storage)**: As fontes de dados são componentes que se conectam a diferentes origens de dados, como APIs ou armazenamento local, para obter e armazenar informações no aplicativo.

## Funcionalidades

O aplicativo inclui várias funcionalidades típicas de diversos aplicativos móveis:

- **Autenticação**: Cadastro e autenticação de usuários

- **CRUDs**: Operações de criação, leitura, atualização e exclusão de dados.

- **Tab Navigation**: Navegação por abas para uma experiência de usuário organizada.

- **Pull to Refresh**: Atualização de conteúdo puxando a tela para baixo.

- **Infinite Scrolling**: Carregamento contínuo de conteúdo à medida que o usuário rola a tela.

- **File Upload**: Envio de arquivos e binários no aplicativo.

- **Optimistic UI**: Feedback instântaneo antes de receber confirmação do servidor para melhor responsividade.

- **Caching**: Armazenamento em cache para melhorar o desempenho e reduzir a carga de rede.

- **Websockets**: Comunicação em tempo real usando websockets.

## Tecnologias Utilizadas

- **[React](https://react.dev)**, como biblioteca de UI/renderização.

- **[React Native](https://reactnative.dev/) e [Expo](https://expo.dev)**, como ferramentas de desenvolvimento multiplataforma.

- **[React Query](https://tanstack.com/query)**, para gerenciamento de estado assíncrono eficiente.

- **[Async Storage](https://react-native-async-storage.github.io/async-storage/)**, para persistência básica de dados.

- **[Nativewind](https://www.nativewind.dev)**, para estilização de componentes.

- **[Reanimated](https://www.reanimated2.com) e [Moti](https://moti.fyi)**, para animações.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- Node.js
- npm (gerenciador de pacotes Node.js)
- React Native CLI

## Instalação e Uso

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/discussions-app.git
   cd discussions-app
   ```
