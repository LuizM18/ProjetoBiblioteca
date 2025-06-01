import React from "react";
import { Link } from "react-router-dom";
import "../styles/custom.css";

const Casa = () => {
  const userCargo = localStorage.getItem("cargo"); // Obter o cargo do usuário

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <div className="text-center mb-5">
        <h1 className="text-primary-custom library-title">Bem-vindo à Biblioteca Escolar</h1>
        <p className="lead text-muted-grey">Navegue pelas opções disponíveis para você.</p>
      </div>

      <div className="row g-4 justify-content-center"> {/* Centraliza os cards */}
        {/* Card para Lista de Livros (visível para todos logados) */}
        <div className="col-md-4 col-lg-3"> {/* Ajustado para 3 colunas em tela grande */}
          <div className="card shadow h-100 option-card-new">
            <div className="card-body d-flex flex-column justify-content-center text-center">
              <i className="bi bi-book-fill icon-large text-secondary-custom mb-3"></i>
              <h5 className="card-title text-dark-blue">Ver Livros</h5>
              <p className="card-text text-muted-grey">Explore o acervo completo da biblioteca.</p>
              <Link to="/livros" className="btn btn-outline-info-custom mt-auto">Acessar</Link>
            </div>
          </div>
        </div>

        {/* Opções visíveis apenas para Administradores */}
        {userCargo === 'administrador' && (
          <>
            <div className="col-md-4 col-lg-3">
              <div className="card shadow h-100 option-card-new">
                <div className="card-body d-flex flex-column justify-content-center text-center">
                  <i className="bi bi-journal-plus icon-large text-primary-custom mb-3"></i>
                  <h5 className="card-title text-dark-blue">Cadastrar Livro</h5>
                  <p className="card-text text-muted-grey">Adicione novos títulos ao acervo.</p>
                  <Link to="/cadastro-livro" className="btn btn-outline-primary-custom mt-auto">Acessar</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card shadow h-100 option-card-new">
                <div className="card-body d-flex flex-column justify-content-center text-center">
                  <i className="bi bi-person-plus-fill icon-large text-success-custom mb-3"></i>
                  <h5 className="card-title text-dark-blue">Cadastrar Funcionário</h5>
                  <p className="card-text text-muted-grey">Gerencie o corpo administrativo da biblioteca.</p>
                  <Link to="/cadastro-funcionario" className="btn btn-outline-success-custom mt-auto">Acessar</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card shadow h-100 option-card-new">
                <div className="card-body d-flex flex-column justify-content-center text-center">
                  <i className="bi bi-mortarboard-fill icon-large text-warning-custom mb-3"></i>
                  <h5 className="card-title text-dark-blue">Cadastrar Aluno</h5>
                  <p className="card-text text-muted-grey">Inclua novos estudantes no sistema.</p>
                  <Link to="/cadastro-aluno" className="btn btn-outline-warning-custom mt-auto">Acessar</Link>
                </div>
              </div>
            </div>

             {/* Dashboard apenas para admin */}
            <div className="col-md-4 col-lg-3">
              <div className="card shadow h-100 option-card-new">
                <div className="card-body d-flex flex-column justify-content-center text-center">
                  <i className="bi bi-speedometer icon-large text-danger-custom mb-3"></i>
                  <h5 className="card-title text-dark-blue">Dashboard</h5>
                  <p className="card-text text-muted-grey">Visualize métricas e relatórios.</p>
                  <Link to="/dashboard" className="btn btn-outline-danger-custom mt-auto">Acessar</Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Lista de Funcionários visível para Administradores e Funcionários */}
        {(userCargo === 'administrador' || userCargo === 'funcionario') && (
          <div className="col-md-4 col-lg-3">
            <div className="card shadow h-100 option-card-new">
              <div className="card-body d-flex flex-column justify-content-center text-center">
                <i className="bi bi-people-fill icon-large text-dark-custom mb-3"></i>
                <h5 className="card-title text-dark-blue">Lista de Funcionários</h5>
                <p className="card-text text-muted-grey">Acesse o cadastro de funcionários.</p>
                <Link to="/lista-funcionario" className="btn btn-outline-dark-custom mt-auto">Acessar</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Casa;