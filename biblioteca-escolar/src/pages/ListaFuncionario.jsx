import React, { useState, useEffect, useContext } from "react";
import customAxios from "../services/axios";
import "../styles/custom.css";
// ATUALIZADO AQUI: Importa LoginContext do novo arquivo
import { LoginContext } from '../context/loginContextObject'; 

const ListaFuncionario = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userLogin } = useContext(LoginContext);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await customAxios.get("/funcionarios");
        setFuncionarios(response.data);
      } catch (err) {
        console.error("Erro ao carregar funcionários:", err.response?.data || err.message);
        setError("Não foi possível carregar a lista de funcionários. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchFuncionarios();
  }, []);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="alert-message error-message">{error}</div>;
  }

  return (
    <div className="container mt-5 admin-section">
      <h2 className="section-title">Lista de Funcionários</h2>

      {funcionarios.length === 0 ? (
        <div className="alert-message info-message">Nenhum funcionário cadastrado.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover admin-table shadow-sm">
            <thead className="table-dark-blue">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Telefone</th>
                <th scope="col">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                // Aplica a classe 'admin-row' se o email do funcionário for o mesmo do ADM logado
                <tr key={funcionario.id_funcionario} className={funcionario.email === userLogin && funcionario.cargo === 'administrador' ? 'admin-row' : ''}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.telefone || "N/A"}</td>
                  <td>{funcionario.cargo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaFuncionario;