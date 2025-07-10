# Event Budy 🎉

**Event Budy** é uma aplicação mobile desenvolvida com **React Native** e **Expo** que permite a gestão e visualização de eventos. O app utiliza autenticação com Firebase, apresenta uma interface intuitiva com navegação por abas, e inclui um conjunto de eventos carregados dinamicamente.

## 🚀 Tecnologias Utilizadas

- [React Native 0.79.5](https://reactnative.dev/)
- [Expo ~53.0.17](https://expo.dev/)
- [Firebase](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- Autenticação via Firebase
- Context API para gerenciamento de autenticação

## 📱 Funcionalidades

- Autenticação de usuários com Firebase
- Visualização de eventos listados a partir de um arquivo JSON (`eventos.json`)
- Navegação com abas inferiores (Bottom Tabs)
- Interface moderna com o uso do React Native Paper
- Suporte a Android, iOS e Web via Expo

## 📁 Estrutura de Pastas
project-root/
├── assets/
│   ├── event-buddy-logo.png
│   ├── profile-icon.png
│   └── snack-icon.png
├── components/
│   └── AppIcon.js
├── context/
│   └── AuthContext.js # Contexto de autenticação
├── screens/
│   ├── EventDetail.js # Página dos detalhes dos eventos
│   ├── Favorites.js # Página com os eventos favoritos do utilizador
│   ├── Home.js # Página onde o utilizador pode ver todos os eventos
│   ├── Login.js # Página onde o utilizador pode iniciar asessão
│   ├── ProfileScreen.js # Página onde o utilizador, confirma os seu dados, o número de eventos que escolheu como favoritos e onde pode terminar a sessão
│   └── Signup.js # Página para o registo de novos utilizadores
├── services/
│   └── firebaseAuth.js # Lógica de autenticação
├── App.js # Componente principal
├── app.json # Configuração do projeto Expo
├── eventos.json # Lista de eventos
├── firebaseConfig.js # Configuração do Firebase
├── index.js # Entrada principal da app
└── package.json # Dependências e scripts


## 🛠️ Scripts Disponíveis

- `npm start` — Inicia o projeto no Expo
- `npm run android` — Abre o app no emulador Android
- `npm run ios` — Abre o app no simulador iOS
- `npm run web` — Executa o app no navegador

## 📦 Instalação

1. Clone o repositório:
bash
git clone https://github.com/Pac0MG/event-budy.git
cd event-budy
2. Instale as dependências:
bash
npm install
3. Configure seu Firebase no arquivo firebaseConfig.js.
4. Inicie o projeto:
bash
npm start

🔒 Licença
GMV

Desenvolvido por Gonçalo Malta Vacas





