// biblioteca-escolar/src/context/LoginContext.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../services/axios'; // Certifique-se de que o caminho para customAxios está correto
import { LoginContext } from './loginContextObject'; // <--- IMPORTADO DO NOVO ARQUIVO

// O Provedor do Contexto (agora é o único export default ou export named principal)
export const LoginProvider = ({ children }) => { // Removida a exportação direta de LoginContext
    // Estados para gerenciar a autenticação
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userLogin, setUserLogin] = useState(null); // Armazena o email/login do usuário

    const navigate = useNavigate(); // Hook para navegação programática

    // Efeito para carregar o estado de autenticação do localStorage ao iniciar a aplicação
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const login = localStorage.getItem('userLogin'); // Pega o login do localStorage

        if (token && role && login) {
            setUserToken(token);
            setUserRole(role);
            setUserLogin(login); // Define o login no estado
            setIsAuthenticated(true);
            // Configura o token no cabeçalho padrão do Axios para todas as requisições
            customAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []); // O array vazio garante que este efeito rode apenas uma vez ao montar o componente

    // Função para realizar o login
    const login = async (email, password) => {
        try {
            const response = await customAxios.post('/usuarios/login', { email, senha: password });
            const { token, cargo } = response.data;

            // Armazena as informações no localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', cargo);
            localStorage.setItem('userLogin', email); // Armazena o email/login

            // Atualiza os estados
            setUserToken(token);
            setUserRole(cargo);
            setUserLogin(email); // Atualiza o login no estado
            setIsAuthenticated(true);

            // Configura o token no cabeçalho padrão do Axios para futuras requisições
            customAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { success: true, cargo }; // Retorna sucesso e cargo
        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
            // Retorna falha com a mensagem de erro
            return { success: false, message: error.response?.data?.message || "Erro no login." };
        }
    };

    // Função para realizar o logout
    const logout = () => {
        // Remove as informações do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userLogin'); // Remove o login

        // Limpa os estados
        setUserToken(null);
        setUserRole(null);
        setUserLogin(null); // Limpa o login
        setIsAuthenticated(false);

        // Remove o token do cabeçalho padrão do Axios
        delete customAxios.defaults.headers.common['Authorization'];

        // Redireciona para a página de login
        navigate('/');
    };

    // O Provedor expõe os valores e funções para os componentes filhos
    return (
        <LoginContext.Provider value={{ isAuthenticated, userToken, userRole, userLogin, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};