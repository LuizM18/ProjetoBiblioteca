import React, { useState } from "react";
import customAxios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../styles/custom.css";

const Cadastro = () => {
  const [alunoData, setAlunoData] = useState({
    nome: "",
    email: "",
    matricula: "",
    data_nascimento: "",
    serie: "",
    turma: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAlunoData({ ...alunoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customAxios.post("/alunos", alunoData);
      alert("Aluno cadastrado com sucesso!");
      setAlunoData({
        nome: "", email: "", matricula: "", data_nascimento: "", serie: "", turma: ""
      });
      navigate('/home');
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error.response?.data || error.message);
      alert(`Erro no cadastro do aluno: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card-container">
        <h2 className="form-title">Cadastrar Aluno (Admin)</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="mb-3">
            <label className="form-label">Nome Completo:</label>
            <input type="text" name="nome" className="form-control" value={alunoData.nome} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" name="email" className="form-control" value={alunoData.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Matrícula:</label>
            <input type="text" name="matricula" className="form-control" value={alunoData.matricula} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Data de Nascimento:</label>
            <input type="date" name="data_nascimento" className="form-control" value={alunoData.data_nascimento} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Série:</label>
            <input type="text" name="serie" className="form-control" value={alunoData.serie} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Turma:</label>
            <input type="text" name="turma" className="form-control" value={alunoData.turma} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-warning-custom w-100 mt-3">Cadastrar Aluno</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;