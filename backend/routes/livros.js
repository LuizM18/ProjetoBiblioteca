const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const verificaToken = require('../middlewares/authMiddleware');
const verificaAdmin = require('../middlewares/verificaAdmin');

// GET todos os livros (protegido por token)
router.get('/', verificaToken, async (req, res) => {
    try {
        const [livros] = await pool.query('SELECT * FROM livros');
        res.json(livros);
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        res.status(500).json({ message: 'Erro ao buscar livros', error: error.message });
    }
});

// GET livro por ID (protegido por token)
router.get('/:id', verificaToken, async (req, res) => {
    try {
        const [livro] = await pool.query('SELECT * FROM livros WHERE id_livro = ?', [req.params.id]);
        if (livro.length === 0) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json(livro[0]);
    } catch (error) {
        console.error('Erro ao buscar livro por ID:', error);
        res.status(500).json({ message: 'Erro ao buscar livro', error: error.message });
    }
});

// POST novo livro (apenas administradores)
router.post('/', verificaToken, verificaAdmin, async (req, res) => {
    const { titulo, autor, ano, genero } = req.body; // Campos do frontend
    if (!titulo || !autor || !ano || !genero) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios para o cadastro de livro.' });
    }
    // Assumindo que 'ano' do frontend corresponde a 'ano_publicacao' no DB e 'genero' a 'id_categoria' ou nova coluna 'genero'
    // Se 'genero' for uma string, pode ser necessário uma tabela de categorias para associar IDs
    const query = 'INSERT INTO livros (titulo, autor, ano_publicacao, genero) VALUES (?, ?, ?, ?)'; // Ajuste aqui as colunas do seu DB
    try {
        const [result] = await pool.query(query, [titulo, autor, ano, genero]);
        res.status(201).json({ message: 'Livro cadastrado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao cadastrar livro:', error);
        res.status(500).json({ message: 'Erro ao cadastrar livro', error: error.message });
    }
});

// PUT atualizar livro (apenas administradores)
router.put('/:id', verificaToken, verificaAdmin, async (req, res) => {
    const { titulo, autor, ano, genero } = req.body;
    if (!titulo || !autor || !ano || !genero) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios para a atualização do livro.' });
    }
    const query = 'UPDATE livros SET titulo=?, autor=?, ano_publicacao=?, genero=? WHERE id_livro=?';
    try {
        const [result] = await pool.query(query, [titulo, autor, ano, genero, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Livro não encontrado para atualização.' });
        }
        res.json({ message: 'Livro atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ message: 'Erro ao atualizar livro', error: error.message });
    }
});

// DELETE livro (apenas administradores)
router.delete('/:id', verificaToken, verificaAdmin, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM livros WHERE id_livro = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Livro não encontrado para exclusão.' });
        }
        res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({ message: 'Erro ao deletar livro', error: error.message });
    }
});

module.exports = router;