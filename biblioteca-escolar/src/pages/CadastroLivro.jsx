import React, { useState, useEffect } from "react";
import customAxios from "../services/axios";
import { useNavigate } from "react-router-dom";
import "../styles/custom.css";

const CadastroLivro = () => {
  const [livroData, setLivroData] = useState({
    titulo: "",
    autor: "",
    editora: "",
    ano_publicacao: "",
    isbn: "",
    id_categoria: "", // Pode ser vazio, um ID existente ou "outra"
    link_trailer_youtube: "",
    url_capa: "",
    url_pdf: "",
    nova_categoria_nome: "" // Novo campo para o admin digitar
  });
  const [categoriasBackend, setCategoriasBackend] = useState([]); // Categorias vindas do backend
  const navigate = useNavigate();

  // Categorias pré-definidas no frontend
  const predefinedCategories = [
    { id: "1", nome: "Ficção Científica" },
    { id: "2", nome: "Fantasia" },
    { id: "3", nome: "Romance" },
    { id: "4", nome: "Mistério" },
    { id: "5", nome: "Suspense" },
    { id: "6", nome: "História" },
    { id: "7", nome: "Biografia" },
    { id: "8", nome: "Autoajuda" },
    { id: "9", nome: "Programação" },
    { id: "10", nome: "Infantil" },
    { id: "11", nome: "Aventura" },
    { id: "12", nome: "Drama" },
    { id: "13", nome: "Terror" },
    { id: "14", nome: "Poesia" },
    { id: "15", nome: "Didático" },
    // Adicione mais categorias conforme necessário
  ];


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await customAxios.get("/categorias");
        setCategoriasBackend(response.data); // Guarda as categorias do backend
      } catch (error) {
        console.error("Erro ao carregar categorias do backend:", error);
        // Não alerta, apenas loga o erro, pois temos as categorias pré-definidas
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    setLivroData({ ...livroData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lógica para garantir que apenas um dos campos de categoria seja enviado
    let categoriaParaEnviar = { ...livroData };
    if (livroData.id_categoria === "outra") { // "outra" é o valor da opção para digitar nova categoria
        // Se "Outra" foi selecionado, enviamos o nome da nova categoria e id_categoria como null
        categoriaParaEnviar.id_categoria = null; // Envia null para o ID, o backend vai criar
        if (!livroData.nova_categoria_nome || livroData.nova_categoria_nome.trim() === '') {
            alert("Por favor, digite o nome da nova categoria.");
            return;
        }
    } else {
        // Se uma categoria existente foi selecionada, limpamos o campo de nova categoria
        categoriaParaEnviar.nova_categoria_nome = null;
        // Se o id_categoria selecionado for um ID de uma categoria pré-definida, ele pode não ser um número.
        // Precisamos encontrar o ID real da categoria no backend se ela existir, ou enviar o que já veio do backend.
        // No entanto, se o valor for um ID numérico de categoria do banco, ele será usado.
        // Se for um ID de uma categoria pré-definida (string), vamos confiar no backend para mapear ou criar.
        // O ideal é que as categorias pré-definidas tenham IDs numéricos reais que existam no banco,
        // ou que se use apenas o nome para criar/vincular.
        // Para simplificar, garantimos que o id_categoria seja um número ou null.
        if (livroData.id_categoria && livroData.id_categoria !== 'outra') {
             categoriaParaEnviar.id_categoria = parseInt(livroData.id_categoria, 10);
        } else {
             categoriaParaEnviar.id_categoria = null;
        }
    }

    try {
        await customAxios.post("/livros", {
            ...categoriaParaEnviar, // Usar o objeto ajustado para categoria
            ano_publicacao: parseInt(livroData.ano_publicacao, 10),
            link_trailer_youtube: livroData.link_trailer_youtube.trim() === '' ? null : livroData.link_trailer_youtube,
            url_capa: livroData.url_capa.trim() === '' ? null : livroData.url_capa,
            url_pdf: livroData.url_pdf.trim() === '' ? null : livroData.url_pdf
        });
        alert("Livro cadastrado com sucesso!");
        setLivroData({ // Limpa o formulário e reset a categoria
            titulo: "", autor: "", editora: "", ano_publicacao: "", isbn: "",
            id_categoria: "", link_trailer_youtube: "", url_capa: "", url_pdf: "",
            nova_categoria_nome: ""
        });
        navigate('/home');
    } catch (error) {
        console.error("Erro ao cadastrar livro:", error.response?.data || error.message);
        alert(`Erro no cadastro do livro: ${error.response?.data?.message || error.message}`);
    }
  };

  // Combina categorias do backend e pré-definidas, priorizando as do backend se houver conflito de ID
  const allCategories = [...predefinedCategories]; // Começa com as pré-definidas

  categoriasBackend.forEach(backendCat => {
      const exists = allCategories.some(predefinedCat => predefinedCat.id === backendCat.id_categoria.toString());
      if (!exists) {
          allCategories.push({ id: backendCat.id_categoria.toString(), nome: backendCat.nome });
      } else {
          // Atualiza o nome da categoria pré-definida com a do backend se houver um ID correspondente
          const index = allCategories.findIndex(cat => cat.id === backendCat.id_categoria.toString());
          if (index !== -1) {
              allCategories[index].nome = backendCat.nome;
          }
      }
  });

  // Opcional: ordenar as categorias combinadas
  allCategories.sort((a, b) => a.nome.localeCompare(b.nome));


  return (
    <div className="form-page-container">
      <div className="form-card-container">
        <h2 className="form-title">Cadastrar Novo Livro</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="mb-3">
            <label className="form-label">Título:</label>
            <input type="text" name="titulo" className="form-control" value={livroData.titulo} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Autor:</label>
            <input type="text" name="autor" className="form-control" value={livroData.autor} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Editora:</label>
            <input type="text" name="editora" className="form-control" value={livroData.editora} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Ano de Publicação:</label>
            <input type="number" name="ano_publicacao" className="form-control" value={livroData.ano_publicacao} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">ISBN:</label>
            <input type="text" name="isbn" className="form-control" value={livroData.isbn} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">ID do Trailer (YouTube):</label>
            <input
              type="text"
              name="link_trailer_youtube"
              className="form-control"
              value={livroData.link_trailer_youtube}
              onChange={handleChange}
              placeholder="Ex: p2t239pJNJM (apenas o ID do vídeo de 11 caracteres)"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">URL da Capa do Livro:</label>
            <input type="url" name="url_capa" className="form-control" value={livroData.url_capa} onChange={handleChange} placeholder="Ex: https://example.com/capa.jpg" />
          </div>
          <div className="mb-3">
            <label className="form-label">URL do PDF do Livro:</label>
            <input type="url" name="url_pdf" className="form-control" value={livroData.url_pdf} onChange={handleChange} placeholder="Ex: https://example.com/livro.pdf" />
          </div>
          <div className="mb-3">
            <label className="form-label">Categoria:</label>
            <select name="id_categoria" className="form-select" value={livroData.id_categoria} onChange={handleChange}>
              <option value="">Selecione uma Categoria</option>
              {/* Renderiza categorias combinadas (pre-definidas + backend) */}
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
              <option value="outra">Outra (digitar abaixo)</option>
            </select>
          </div>
          {livroData.id_categoria === "outra" && (
            <div className="mb-3">
              <label className="form-label">Nome da Nova Categoria:</label>
              <input
                type="text"
                name="nova_categoria_nome"
                className="form-control"
                value={livroData.nova_categoria_nome}
                onChange={handleChange}
                required={livroData.id_categoria === "outra"}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary-custom w-100 mt-3">Cadastrar Livro</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroLivro;