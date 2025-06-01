import React, { useState, useEffect } from "react";
import customAxios from "../services/axios";
import "../styles/custom.css"; // Importa os estilos CSS globais

const GerenciarLivros = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    setLoading(true);
    try {
      // Usa a mesma rota de listar livros, que já retorna as informações de categoria
      const response = await customAxios.get("/livros");
      setLivros(response.data);
    } catch (err) {
      console.error("Erro ao carregar livros para gerenciamento:", err.response?.data || err.message);
      setError("Não foi possível carregar os livros. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLivro = async (id_livro, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${titulo}"? Esta ação é irreversível!`)) {
      try {
        await customAxios.delete(`/livros/${id_livro}`);
        alert(`Livro "${titulo}" excluído com sucesso!`);
        fetchLivros(); // Recarrega a lista de livros após a exclusão
      } catch (error) {
        console.error("Erro ao excluir livro:", error.response?.data || error.message);
        alert(`Erro ao excluir livro: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="alert-message error-message">{error}</div>;
  }

  return (
    <div className="container mt-5 admin-section">
      <h2 className="section-title">Gerenciar Livros</h2>

      {livros.length === 0 ? (
        <div className="alert-message info-message">Nenhum livro cadastrado no acervo.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover admin-table shadow-sm">
            <thead className="table-dark-blue">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Título</th>
                <th scope="col">Autor</th>
                <th scope="col">Editora</th>
                <th scope="col">Ano</th>
                <th scope="col">Categoria</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => (
                <tr key={livro.id_livro}>
                  <td>{livro.id_livro}</td>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor}</td>
                  <td>{livro.editora || "N/A"}</td>
                  <td>{livro.ano_publicacao}</td>
                  <td>{livro.categoria_nome || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger-custom btn-sm"
                      onClick={() => handleDeleteLivro(livro.id_livro, livro.titulo)}
                    >
                      Excluir <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GerenciarLivros;