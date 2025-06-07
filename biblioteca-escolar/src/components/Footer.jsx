import React from 'react';
import '../styles/custom.css'; // Certifique-se que está importando

const Footer = () => {
    return (
        <footer className="footer-custom mt-auto"> {/* Adicionado mt-auto do Bootstrap */}
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Biblioteca Escolar. Todos os direitos reservados.</p>
                <p>Desenvolvido com <i className="bi bi-heart-fill text-danger"></i> por LuizM.</p>
                <p>Versão 1.0.0</p>
            </div>
        </footer>
    );
};

export default Footer;