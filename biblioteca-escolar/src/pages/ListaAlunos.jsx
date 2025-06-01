// src/pages/ListaAlunos.jsx
import React, { useState, useEffect, useContext } from 'react';
import customAxios from '../services/axios';
import { LoginContext } from '../context/loginContextObject';
import '../styles/custom.css'; // Para o tema

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userRole } = useContext(LoginContext); // Para verificar o cargo do usuário

    const fetchAlunos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await customAxios.get('/alunos');
            setAlunos(response.data);
        } catch (err) {
            console.error("Erro ao buscar alunos:", err);
            setError("Não foi possível carregar os alunos. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlunos();
    }, []);

    const handleDeleteAluno = async (id_aluno) => {
        if (!window.confirm("Tem certeza que deseja excluir este aluno? Esta ação é irreversível e removerá também a conta de usuário associada.")) {
            return;
        }

        try {
            await customAxios.delete(`/alunos/${id_aluno}`);
            alert("Aluno e usuário associado excluídos com sucesso!");
            fetchAlunos(); // Recarrega a lista após a exclusão
        } catch (err) {
            console.error("Erro ao excluir aluno:", err);
            alert(`Erro ao excluir aluno: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return <div className="loading-message">Carregando alunos...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="list-container">
            <h2 className="list-title">Lista de Alunos</h2>
            {alunos.length === 0 ? (
                <p>Nenhum aluno cadastrado.</p>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Matrícula</th>
                                <th>Turma</th>
                                {userRole === 'administrador' && <th>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno) => (
                                <tr key={aluno.id_aluno}>
                                    <td>{aluno.id_aluno}</td>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.email || 'N/A'}</td>
                                    <td>{aluno.matricula}</td>
                                    <td>{aluno.turma || 'N/A'}</td>
                                    {userRole === 'administrador' && (
                                        <td>
                                            <button
                                                className="btn btn-danger-custom"
                                                onClick={() => handleDeleteAluno(aluno.id_aluno)}
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ListaAlunos;