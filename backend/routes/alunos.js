// routes/alunos.js
const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Usar o pool
const verificaToken = require('../middlewares/authMiddleware');
const verificaAdmin = require('../middlewares/verificaAdmin');

// GET - listar todos os alunos (protegido por token, qualquer usuário logado)
router.get('/', verificaToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM alunos');
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }
});

// POST - cadastrar novo aluno (apenas administradores)
router.post('/', verificaToken, verificaAdmin, async (req, res) => {
    const { nome, email, matricula, turma } = req.body; // Campos do frontend
    if (!nome || !email || !matricula || !turma) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios para o cadastro de aluno.' });
    }
    const query = 'INSERT INTO alunos (nome, email, matricula, turma) VALUES (?, ?, ?, ?)'; // Ajustar colunas da tabela se necessário
    try {
        const [result] = await pool.query(query, [nome, email, matricula, turma]);
        res.status(201).json({ message: 'Aluno cadastrado com sucesso', id: result.insertId });
    } catch (err) {
        console.error('Erro ao cadastrar aluno:', err);
        res.status(500).json({ error: 'Erro ao cadastrar aluno.', details: err.message });
    }
});

// PUT - atualizar aluno por ID (apenas administradores)
router.put('/:id', verificaToken, verificaAdmin, async (req, res) => {
    const { nome, email, matricula, turma } = req.body;
    if (!nome || !email || !matricula || !turma) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios para a atualização do aluno.' });
    }
    const query = 'UPDATE alunos SET nome = ?, email = ?, matricula = ?, turma = ? WHERE id_aluno = ?';
    try {
        const [result] = await pool.query(query, [nome, email, matricula, turma, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado para atualização.' });
        }
        res.json({ message: 'Aluno atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar aluno:', err);
        res.status(500).json({ error: 'Erro ao atualizar aluno', details: err.message });
    }
});

// DELETE - remover aluno por ID (apenas administradores)
router.delete('/:id', verificaToken, verificaAdmin, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM alunos WHERE id_aluno = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado para exclusão.' });
        }
        res.json({ message: 'Aluno removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover aluno:', err);
        res.status(500).json({ error: 'Erro ao remover aluno', details: err.message });
    }
});

module.exports = router;