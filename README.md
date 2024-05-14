# Discussions App

## Introdução

Este projeto é um aplicativo multiplataforma de discussões (ou fóruns) desenvolvido com React Native. Ele é projetado com uma arquitetura clara e incorpora várias funcionalidades essenciais. O propósito é fornecer um modelo para funcionalidades típicas de aplicativos mobile, como autenticação, CRUDs, scroll infinito, entre outros.

## Arquitetura

### Camada de Interface (UI Layer)

**Elementos visuais e interação**

- O papel da IU é mostrar os dados do app na tela e atuar como o ponto principal de interação do usuário.
- Os componentes React e React Native são os responsáveis pela renderização e interatividade.

**Gerenciadores de Estado**

- O estado é o que modela a forma como os componentes visuais vão apresentar as informações na tela.
- O estado puramente local pode ser controlado e consumido com recursos do React, como `useState`, `useReducer`, e `useContext`.
- Por outro lado, todo estado que se origina de fontes externas, geralmente assíncrono, é gerenciado com o **React Query**, que oferece otimizações para controlar esse tipo de estado de forma eficiente.

### Camada de Dados (Data Layer)

**Repositórios**

- Os repositórios interagem com as fontes de dados (data sources) para buscar e salvar informações.
- Eles são responsáveis por fornecer uma camada de abstração entre a camada de dados e a camada de interface do usuário.
- Dessa forma, mudanças na forma como os dados são obtidos ou tratados não afetarão os componentes.

**Data Transfer Objects**

- Os Data Transfer Objects (DTOs), representam os dados que são transferidos entre a camada de dados e a camada de interface.
- Nessa arquitetura, os DTOS são definidos através de interfaces TypeScript

**Fontes de dados**

- As fontes de dados são componentes que se conectam a diferentes origens de dados, como APIs ou armazenamento local, para obter e armazenar informações no aplicativo.

## Funcionalidades

O aplicativo inclui várias funcionalidades típicas de diversos aplicativos móveis:

- **Autenticação**: Cadastro e autenticação de usuários

- **CRUDs**: Operações de criação, leitura, atualização e exclusão de dados.

- **Tab Navigation**: Navegação por abas para rápido acesso aos principais recursos.

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

- **[React Hook Form](https://react-hook-form.com)**, para controle e validação de formulários.

- **[Async Storage](https://react-native-async-storage.github.io/async-storage/)**, para persistência básica de dados.

- **[Nativewind](https://www.nativewind.dev)**, para estilização de componentes.

- **[Reanimated](https://www.reanimated2.com) e [Moti](https://moti.fyi)**, para animações.

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/okalil/discussions-app.git
cd carbono-neutro-app
```

2. Instale as dependências

```bash
npm install
```

3. Execute o servidor local via tunnel, e abra o app usando o Expo Go ou development build

```bash
npm start -- --tunnel
```
