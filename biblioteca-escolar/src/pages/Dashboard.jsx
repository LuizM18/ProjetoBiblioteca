import React from "react";
import "../styles/custom.css";

export default function Dashboard() {
  return (
    <div className="container py-5">
      <h1 className="text-center text-success mb-4 animate__animated animate__zoomIn">Painel da Biblioteca</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-primary shadow-sm p-3 text-center h-100">
            <h5>Alunos Cadastrados</h5>
            <p className="display-6 text-primary">120</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success shadow-sm p-3 text-center h-100">
            <h5>Livros Disponíveis</h5>
            <p className="display-6 text-success">340</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning shadow-sm p-3 text-center h-100">
            <h5>Empréstimos Ativos</h5>
            <p className="display-6 text-warning">78</p>
          </div>
        </div>
      </div>
    </div>
  );
}
