import React, { useState, useEffect, useRef } from "react";
import customAxios from "../services/axios";
import { Modal } from "bootstrap";
import "../styles/custom.css";

const ListaLivros = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrailerEmbedId, setCurrentTrailerEmbedId] = useState("");

  const trailerModalRef = useRef(null); // Ref para a instância do modal Bootstrap

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await customAxios.get("/livros");
        setLivros(response.data);
      } catch (err) {
        console.error("Erro ao carregar livros:", err.response?.data || err.message);
        setError("Não foi possível carregar os livros. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();

    // Inicializa o modal Bootstrap após a montagem do componente
    // e garante que a instância seja armazenada no ref
    const trailerModalElement = document.getElementById('trailerModal');
    if (trailerModalElement && !trailerModalRef.current) {
      trailerModalRef.current = new Modal(trailerModalElement);

      // Adiciona um listener para limpar o embedId quando o modal for escondido
      trailerModalElement.addEventListener('hidden.bs.modal', () => {
        setCurrentTrailerEmbedId(""); // Isso vai parar o vídeo limpando o src do iframe
      });
    }

    // Limpa a instância do modal e remove o listener quando o componente é desmontado
    return () => {
      if (trailerModalRef.current) {
        // Antes de dispor, remove o listener para evitar vazamento de memória
        if (trailerModalElement) {
          trailerModalElement.removeEventListener('hidden.bs.modal', () => {
            setCurrentTrailerEmbedId("");
          });
        }
        trailerModalRef.current.dispose();
        trailerModalRef.current = null;
      }
    };
  }, []); // O array vazio garante que o useEffect rode apenas uma vez (didMount)

  // Função mais robusta para obter o ID do YouTube
  const getYouTubeEmbedId = (urlOrId) => {
    if (!urlOrId) return null;

    // Se o input já é um ID de 11 caracteres (alfanumérico, _ ou -)
    if (typeof urlOrId === 'string' && urlOrId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(urlOrId)) {
      return urlOrId;
    }

    // Tenta extrair o ID de URLs completas (watch, embed, youtu.be)
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([a-zA-Z0-9_-]{11})(?:\S+)?/g;
    const match = regExp.exec(urlOrId);
    return (match && match[1]) ? match[1] : null;
  };

  const handleShowTrailer = (youtubeUrlOrId) => {
    const embedId = getYouTubeEmbedId(youtubeUrlOrId);
    if (embedId) {
      setCurrentTrailerEmbedId(embedId);
      if (trailerModalRef.current) {
        trailerModalRef.current.show();
      }
    } else {
      alert("ID/Link de trailer inválido ou não fornecido para este livro.");
      setCurrentTrailerEmbedId(""); // Garante que o iframe esteja vazio
    }
  };

  const handleCloseTrailerModal = () => {
    // O listener 'hidden.bs.modal' já cuida de limpar setCurrentTrailerEmbedId
    if (trailerModalRef.current) {
      trailerModalRef.current.hide();
    }
  };

  const handleReadPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank'); // Abre o PDF em uma nova aba
    } else {
      alert("URL do PDF não fornecida para este livro.");
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="alert-message error-message">{error}</div>;
  }

  return (
    <div className="container mt-5 library-section">
      <h2 className="section-title">Acervo de Livros</h2>

      {livros.length === 0 ? (
        <div className="alert-message info-message">Nenhum livro encontrado no acervo.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {livros.map((livro) => (
            <div className="col" key={livro.id_livro}>
              <div className="card book-card shadow-sm animate__animated animate__fadeInUp">
                {livro.url_capa ? (
                  <img src={livro.url_capa} className="card-img-top book-cover" alt={`Capa de ${livro.titulo}`} />
                ) : (
                  <div className="book-cover-placeholder">Capa Não Disponível</div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark-blue">{livro.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted-brown">Autor: {livro.autor}</h6>
                  <p className="card-text text-muted-grey flex-grow-1">
                    Editora: {livro.editora || "N/A"}<br/>
                    Ano: {livro.ano_publicacao}<br/>
                    ISBN: {livro.isbn || "N/A"}<br/>
                    Categoria: {livro.categoria_nome || "Geral"}
                  </p>
                  <div className="d-flex justify-content-between mt-auto">
                    {livro.link_trailer_youtube && (
                      <button
                        className="btn btn-trailer flex-grow-1 me-2"
                        onClick={() => handleShowTrailer(livro.link_trailer_youtube)}
                      >
                        Ver Trailer <i className="bi bi-play-circle"></i>
                      </button>
                    )}
                    {livro.url_pdf && (
                      <button
                        className="btn btn-read-pdf flex-grow-1"
                        onClick={() => handleReadPdf(livro.url_pdf)}
                      >
                        Ler Livro <i className="bi bi-book"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para o Trailer */}
      <div className="modal fade" id="trailerModal" tabIndex="-1" aria-labelledby="trailerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-dark-blue text-white">
              <h5 className="modal-title" id="trailerModalLabel">Trailer do Livro</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseTrailerModal}></button>
            </div>
            <div className="modal-body p-0" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
              {/* O iframe só renderiza se houver um currentTrailerEmbedId */}
              {currentTrailerEmbedId && (
                <iframe
                  // CORREÇÃO CRÍTICA NA URL DE EMBED DO YOUTUBE
                  src={`https://www.youtube.com/embed/${currentTrailerEmbedId}?autoplay=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaLivros;