import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Casa from "./pages/Casa";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import CadastroLivro from "./pages/CadastroLivro";
import ListaFuncionario from "./pages/ListaFuncionario";
import ListaLivros from "./pages/ListaLivros";
import GerenciarLivros from "./pages/GerenciarLivros";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CadastroGeral from "./pages/CadastroGeral";
import CadastroAlunoUser from "./pages/CadastroAlunoUser";

// Importe AMBOS: o Provedor E o Objeto de Contexto
import { LoginProvider } from './context/LoginContext.jsx'; // <-- O Provedor
import { LoginContext } from './context/loginContextObject'; // <-- O Objeto de Contexto

// NOVO COMPONENTE: AppLayout
// Este componente será filho do LoginProvider e do Router,
// então ele pode usar useContext(LoginContext) e renderizar as rotas.
function AppLayout() {
  const { userRole } = useContext(LoginContext); // AGORA É SEGURO: LoginProvider já está acima

  const appClassName = userRole === 'administrador' ? 'app-container admin-theme' : 'app-container';

  return (
    <div className={appClassName}>
      <Navbar /> {/* Navbar usa useContext(LoginContext) */}
      <div className="content-wrap">
        <Routes> {/* As Rotas estão aqui, dentro do Router */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro-geral" element={<CadastroGeral />} />
          <Route path="/cadastro-aluno-user" element={<CadastroAlunoUser />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Casa />} />
            <Route path="/livros" element={<ListaLivros />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lista-funcionario" element={<ListaFuncionario />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['administrador']} />}>
            <Route path="/cadastro-aluno" element={<Cadastro />} />
            <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
            <Route path="/cadastro-livro" element={<CadastroLivro />} />
            <Route path="/gerenciar-livros" element={<GerenciarLivros />} />
          </Route>

          <Route path="*" element={<h1 className="text-center mt-5 text-primary-custom">404 - Página Não Encontrada</h1>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

// O componente App principal:
// Ele configura o Router e o LoginProvider, que são essenciais para o resto da aplicação.
function App() {
  return (
    <Router> {/* <-- O BrowserRouter (Router) é o mais externo */}
      <LoginProvider> {/* <-- O LoginProvider ESTÁ DENTRO do Router (pode usar useNavigate) */}
        <AppLayout /> {/* <-- AppLayout ESTÁ DENTRO do LoginProvider (pode usar useContext) */}
      </LoginProvider>
    </Router>
  );
}

export default App;