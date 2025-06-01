import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/custom.css';

function NotFound() {
    return (
        <div className="list-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h2 className="form-title" style={{ fontSize: '3em', marginBottom: '20px' }}>404 - Página Não Encontrada</h2>
            <p style={{ fontSize: '1.2em', color: 'var(--text-medium)' }}>
                Parece que você se perdeu no espaço da biblioteca.
            </p>
            <Link to="/home" className="btn btn-primary-custom" style={{ marginTop: '30px' }}>
                Voltar para a Página Inicial
            </Link>
        </div>
    );
}

export default NotFound;