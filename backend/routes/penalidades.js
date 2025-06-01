const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// POST nova penalidade
router.post('/', async (req, res) => {
  const { id_aluno, id_emprestimo, tipo, valor, data_aplicacao } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO penalidades (id_aluno, id_emprestimo, tipo, valor, data_aplicacao) VALUES (?, ?, ?, ?, ?)',
      [id_aluno, id_emprestimo, tipo, valor, data_aplicacao]
    );
    res.status(201).json({ message: 'Penalidade registrada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar penalidade', error });
  }
});
module.exports = router;
