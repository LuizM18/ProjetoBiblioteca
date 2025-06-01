import React, { useState, useContext } from "react";
// REMOVA ESTA LINHA: import customAxios from "../services/axios"; 
// Não é mais usada diretamente neste arquivo, pois a função 'login' do contexto a utiliza.
import { useNavigate, Link } from "react-router-dom";
import "../styles/custom.css";
import { LoginContext } from '../context/loginContextObject'; // Importe o LoginContext

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate(); // 'navigate' é usada abaixo
    const { login } = useContext(LoginContext); // Use o hook useContext para obter a função login do contexto

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Chama a função 'login' do contexto.
            // Esta função lida com a requisição POST para o backend,
            // armazenamento no localStorage e atualização dos estados do contexto (userRole, etc.).
            const result = await login(email, senha); 

            if (result.success) {
                // A função 'login' do contexto não navega, então o Login.jsx deve fazer isso.
                navigate("/home"); // <--- 'navigate' está sendo usado aqui!
            } else {
                // Caso a função login do contexto retorne falha (já faz o console.error internamente)
                alert(`Login inválido. ${result.message || 'Verifique suas credenciais.'}`);
            }
        } catch (err) {
            // Este catch pega erros inesperados na própria chamada da função 'login' do contexto.
            console.error("Erro inesperado no processo de login:", err);
            alert("Ocorreu um erro inesperado. Tente novamente.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="form-title">Login Biblioteca</h2>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input type="password" className="form-control" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary-custom w-100 mt-3">Entrar</button>
                <hr className="my-4" />
                <p className="text-center mb-0 text-muted-grey">Não tem uma conta?</p>
                <div className="d-grid gap-2">
                    <Link to="/cadastro-geral" className="btn btn-outline-secondary-custom mt-2">Criar Conta</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;