const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// POST adicionar livro a um empréstimo
router.post('/', async (req, res) => {
  const { id_emprestimo, id_exemplar } = req.body;
  try {
    await pool.query(
      'INSERT INTO livros_emprestados (id_emprestimo, id_exemplar) VALUES (?, ?)',
      [id_emprestimo, id_exemplar]
    );
    res.status(201).json({ message: 'Livro adicionado ao empréstimo' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar livro', error });
  }
});
module.exports = router;
