const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET todos os empréstimos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM emprestimos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empréstimos', error });
  }
});

// POST novo empréstimo
router.post('/', async (req, res) => {
  const { id_aluno, id_funcionario, data_emprestimo, data_devolucao_prevista } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO emprestimos (id_aluno, id_funcionario, data_emprestimo, data_devolucao_prevista) VALUES (?, ?, ?, ?)',
      [id_aluno, id_funcionario, data_emprestimo, data_devolucao_prevista]
    );
    res.status(201).json({ message: 'Empréstimo registrado com sucesso', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar empréstimo', error });
  }
});

module.exports = router;
