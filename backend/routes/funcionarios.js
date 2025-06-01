const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Usar o pool
const verificaToken = require('../middlewares/authMiddleware');
const verificaAdmin = require('../middlewares/verificaAdmin');

// GET - Listar todos os funcionários (protegido por token)
router.get('/', verificaToken, async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM funcionarios');
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar funcionários:', err);
        res.status(500).json({ erro: 'Erro interno do servidor', details: err.message });
    }
});

// POST - Cadastrar novo funcionário (Dados, não credenciais de login) (apenas administradores)
router.post('/', verificaToken, verificaAdmin, async (req, res) => {
    const { nome, email, cargo, telefone } = req.body; // Ajustado para os campos do frontend + cargo/telefone
    // Nota: O frontend atualmente envia 'nome', 'email', 'senha'.
    // Para o cadastro de funcionários como *dados* de funcionário, 'senha' não se aplica aqui.
    // O ideal é que o frontend envie 'nome', 'email', 'cargo', 'telefone' para esta rota.
    // O cadastro da senha e criação do usuário para login deve ser feito em outra etapa ou em outro endpoint.
    if (!nome || !email) { // Adicionar mais validações conforme 'cargo' e 'telefone'
        return res.status(400).json({ message: 'Nome e email são obrigatórios para cadastrar funcionário.' });
    }
    const sql = 'INSERT INTO funcionarios (nome, email, cargo, telefone) VALUES (?, ?, ?, ?)';
    try {
        const [result] = await pool.query(sql, [nome, email, cargo || null, telefone || null]); // Ajustar colunas da tabela
        res.status(201).json({ mensagem: 'Funcionário cadastrado com sucesso', id: result.insertId });
    } catch (err) {
        console.error('Erro ao cadastrar funcionário:', err);
        res.status(500).json({ erro: 'Erro ao cadastrar funcionário', details: err.message });
    }
});

// Rotas PUT e DELETE para funcionários seguiriam o mesmo padrão de proteção e uso do pool.
// Exemplo:
router.put('/:id', verificaToken, verificaAdmin, async (req, res) => {
    const { nome, email, cargo, telefone } = req.body;
    const sql = 'UPDATE funcionarios SET nome = ?, email = ?, cargo = ?, telefone = ? WHERE id_funcionario = ?';
    try {
        const [result] = await pool.query(sql, [nome, email, cargo, telefone, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
        res.json({ message: 'Funcionário atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar funcionário:', err);
        res.status(500).json({ erro: 'Erro ao atualizar funcionário', details: err.message });
    }
});

router.delete('/:id', verificaToken, verificaAdmin, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM funcionarios WHERE id_funcionario = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
        res.json({ message: 'Funcionário removido com sucesso' });
    } catch (err) {
        console.error('Erro ao remover funcionário:', err);
        res.status(500).json({ erro: 'Erro ao remover funcionário', details: err.message });
    }
});

module.exports = router;