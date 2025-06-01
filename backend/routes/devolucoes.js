const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// POST registrar devolução
router.post('/', async (req, res) => {
  const { id_emprestimo, id_exemplar, data_devolucao, estado_livro, multa } = req.body;
  try {
    await pool.query(
      'INSERT INTO devolucoes (id_emprestimo, id_exemplar, data_devolucao, estado_livro, multa) VALUES (?, ?, ?, ?, ?)',
      [id_emprestimo, id_exemplar, data_devolucao, estado_livro, multa]
    );
    res.status(201).json({ message: 'Devolução registrada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar devolução', error });
  }
});
module.exports = router;
