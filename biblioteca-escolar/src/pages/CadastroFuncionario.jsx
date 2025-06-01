import React, { useState } from "react";
import customAxios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../styles/custom.css";

const CadastroFuncionario = () => {
  const [funcionarioData, setFuncionarioData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "funcionario",
    senha: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFuncionarioData({ ...funcionarioData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customAxios.post("/funcionarios", funcionarioData);
      alert("Funcionário e conta de usuário criados com sucesso!");
      setFuncionarioData({
        nome: "", email: "", telefone: "", cargo: "funcionario", senha: ""
      });
      navigate('/home');
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error.response?.data || error.message);
      alert(`Erro no cadastro do funcionário: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card-container">
        <h2 className="form-title">Cadastrar Novo Funcionário</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="mb-3">
            <label className="form-label">Nome Completo:</label>
            <input type="text" name="nome" className="form-control" value={funcionarioData.nome} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email (Login):</label>
            <input type="email" name="email" className="form-control" value={funcionarioData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefone (Opcional):</label>
            <input type="text" name="telefone" className="form-control" value={funcionarioData.telefone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Cargo:</label>
            <select name="cargo" className="form-select" value={funcionarioData.cargo} onChange={handleChange} required>
              <option value="funcionario">Funcionário</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Senha:</label>
            <input type="password" name="senha" className="form-control" value={funcionarioData.senha} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success-custom w-100 mt-3">Cadastrar Funcionário</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroFuncionario;