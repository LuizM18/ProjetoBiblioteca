import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// ATUALIZADO AQUI: Importa LoginContext do novo arquivo
import { LoginContext } from '../context/loginContextObject'; 
import '../styles/custom.css';

const Navbar = () => {
    const { isAuthenticated, userRole, logout } = useContext(LoginContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary-custom">
            <div className="container">
                <Link className="navbar-brand navbar-brand-custom" to="/home">
                    <i className="bi bi-book-half me-2"></i> Biblioteca Escolar
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link nav-link-custom" to="/home">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link nav-link-custom" to="/livros">Acervo</Link>
                                </li>
                                {userRole === 'administrador' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link nav-link-custom" to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link nav-link-custom" to="/cadastro-livro">Add Livro</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link nav-link-custom" to="/gerenciar-livros">Gerenciar Livros</Link>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link nav-link-custom dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Admin
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="adminDropdown">
                                                <li><Link className="dropdown-item" to="/cadastro-aluno">Cadastrar Aluno</Link></li>
                                                <li><Link className="dropdown-item" to="/cadastro-funcionario">Cadastrar Funcionário</Link></li>
                                                <li><Link className="dropdown-item" to="/lista-funcionario">Lista Funcionários</Link></li>
                                            </ul>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-outline-light-custom" onClick={logout}>Sair</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link nav-link-custom" to="/">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link nav-link-custom" to="/cadastro-geral">Cadastrar-se</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;