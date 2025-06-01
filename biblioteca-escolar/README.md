# 📚 Projeto Biblioteca V. Final

![Capa do Projeto ou Banner Atraente](https://via.placeholder.com/800x200?text=Sistema+de+Gerenciamento+de+Biblioteca)

## 🌟 Visão Geral

Este é um **Sistema de Gerenciamento de Biblioteca completo**, desenvolvido como um projeto de estudo e aplicação de conceitos Fullstack. Ele oferece funcionalidades robustas para **cadastro e gestão de livros, usuários (alunos e funcionários), empréstimos, devoluções, reservas e penalidades**, com um painel administrativo temático e intuitivo.

O objetivo principal deste projeto foi aprimorar conhecimentos em:
* Desenvolvimento frontend com **React.js** e componentes reutilizáveis.
* Criação de APIs RESTful com **Node.js (Express)**.
* Gerenciamento de banco de dados relacional (**MySQL** ou **SQLite**).
* Implementação de autenticação e autorização (JWT).
* Design responsivo e temas CSS dinâmicos (Tema Padrão e Tema Admin Cósmico).

---

## ✨ Funcionalidades

* **Autenticação e Autorização:** Login de usuários (alunos e funcionários) com diferentes níveis de acesso.
* **Gestão de Livros:** Cadastro, listagem, busca e detalhes de livros.
* **Empréstimos e Devoluções:** Sistema completo de registro e acompanhamento.
* **Reservas:** Funcionalidade para reservar livros disponíveis.
* **Penalidades:** Registro e gestão de penalidades por atraso.
* **Gestão de Usuários:** Cadastro de novos alunos e funcionários.
* **Painel Administrativo:** Interface dedicada com tema visual diferenciado para gestão de usuários e livros (incluindo uma "linha ADM" destacada na tabela de funcionários!).
* **Temas Dinâmicos:** Interface principal com tema padrão e painel administrativo com um tema "Dark Cósmico" com animações CSS.

---

## 🚀 Tecnologias Utilizadas

### Frontend (biblioteca-escolar)
* **React.js**
* **Vite:** Usado como empacotador e servidor de desenvolvimento para uma experiência de desenvolvimento rápida.
    * **Hot Module Replacement (HMR):** Recarregamento rápido sem perder o estado da aplicação.
    * **ESLint:** Configurado para manter a qualidade do código.
        * `@vitejs/plugin-react`: Usa Babel para Fast Refresh.
        * `@vitejs/plugin-react-swc`: Usa SWC para Fast Refresh (opcional, para performance).
    * Para configurações ESLint mais avançadas, especialmente em produção com TypeScript, consulte o [TS template do Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).
* **React Router DOM:** Para gerenciamento de rotas.
* **Bootstrap 5:** Framework CSS para estilização (com customização extensiva em CSS).
* **Axios:** Para requisições HTTP à API.
* **`custom.css`:** Arquivo crucial para estilização avançada, temas personalizados e o tema "Dark Cósmica".

### Backend (Node.js)
* **Node.js**
* **Express.js:** Framework web para criação da API RESTful.
* **MySQL** ou **SQLite:** Sistema de Gerenciamento de Banco de Dados.
* **Sequelize** (ou outro ORM/Driver de banco de dados, ex: `mysql2`, `sqlite3`): Para interação com o banco de dados.
* **JSON Web Tokens (JWT):** Para autenticação segura de usuários.
* **Bcrypt.js:** Para hashing seguro de senhas.

---

## 🛠️ Como Executar o Projeto Localmente

Siga estas instruções para configurar e rodar o projeto em sua máquina.

### Pré-requisitos

Certifique-se de ter instalado:
* Node.js (versão 14 ou superior recomendada)
* npm ou Yarn
* Um servidor de banco de dados MySQL ou SQLite (dependendo da sua configuração de backend)

### 1. Clonar o Repositório

```bash
git clone [https://github.com/LuizM18/ProjetoBibliotecaVFinal.git](https://github.com/LuizM18/ProjetoBiblioteca.git)
cd ProjetoBiblioteca