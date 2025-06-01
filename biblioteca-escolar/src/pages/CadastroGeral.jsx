import React from 'react';
import { Link } from 'react-router-dom';

const CadastroGeral = () => {
  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Como você gostaria de se cadastrar?</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 mb-3">
          <div className="card shadow h-100 p-4">
            <h5 className="card-title">Sou um Aluno</h5>
            <p className="card-text">Cadastre-se como aluno para acessar recursos da biblioteca e gerenciar seus empréstimos.</p>
            <Link to="/cadastro-aluno-user" className="btn btn-warning mt-auto">Cadastrar Aluno</Link>
          </div>
        </div>
      </div>
      <p className="mt-4 text-muted">Para cadastro de funcionários, entre em contato com a administração.</p>
    </div>
  );
};

export default CadastroGeral;