import React, { useState } from "react";
import customAxios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../styles/custom.css";

const CadastroAlunoUser = () => {
  const [alunoData, setAlunoData] = useState({
    nome: "",
    email: "",
    matricula: "",
    turma: "",
    senha: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAlunoData({ ...alunoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customAxios.post("/alunos/register", alunoData);
      alert("Cadastro de aluno e usuário de login realizado com sucesso!");
      navigate("/"); // Redirecionar para o login após o cadastro
    } catch (error) {
      console.error("Erro ao cadastrar aluno ou usuário:", error.response?.data || error.message);
      alert(`Erro no cadastro: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card-container">
        <h2 className="form-title">Cadastro de Aluno (Novo Usuário)</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="mb-3">
            <label className="form-label">Nome Completo:</label>
            <input type="text" name="nome" className="form-control" value={alunoData.nome} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email (Será seu Login):</label>
            <input type="email" name="email" className="form-control" value={alunoData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Matrícula:</label>
            <input type="text" name="matricula" className="form-control" value={alunoData.matricula} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Turma:</label>
            <input type="text" aname="turma" className="form-control" value={alunoData.turma} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Crie sua Senha:</label>
            <input type="password" name="senha" className="form-control" value={alunoData.senha} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-warning-custom w-100 mt-3">Cadastrar e Criar Login</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroAlunoUser;