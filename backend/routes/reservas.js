const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// POST nova reserva
router.post('/', async (req, res) => {
  const { id_aluno, id_exemplar, data_reserva } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO reservas (id_aluno, id_exemplar, data_reserva) VALUES (?, ?, ?)',
      [id_aluno, id_exemplar, data_reserva]
    );
    res.status(201).json({ message: 'Reserva registrada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar reserva', error });
  }
});
module.exports = router;
