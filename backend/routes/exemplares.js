const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET todos os exemplares
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM exemplares');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar exemplares', error });
  }
});

// POST novo exemplar
router.post('/', async (req, res) => {
  const { id_livro, codigo_exemplar, estado } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO exemplares (id_livro, codigo_exemplar, estado) VALUES (?, ?, ?)',
      [id_livro, codigo_exemplar, estado || 'bom']
    );
    res.status(201).json({ message: 'Exemplar adicionado com sucesso', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar exemplar', error });
  }
});

module.exports = router;
