const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET todas as categorias
router.get('/', async (req, res) => {
  try {
    const [categorias] = await pool.query('SELECT * FROM categorias');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categorias', error });
  }
});

// GET categoria por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [categoria] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    if (categoria.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json(categoria[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categoria', error });
  }
});

// POST nova categoria
router.post('/', async (req, res) => {
  const { nome } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO categorias (nome) VALUES (?)', [nome]);
    res.status(201).json({ message: 'Categoria criada com sucesso', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar categoria', error });
  }
});

// PUT atualizar categoria
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    await pool.query('UPDATE categorias SET nome = ? WHERE id_categoria = ?', [nome, id]);
    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar categoria', error });
  }
});

// DELETE categoria
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar categoria', error });
  }
});

module.exports = router;
