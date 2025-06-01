const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Usar o pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Carregar variáveis de ambiente
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'umSegredoMuitoSecretoEVaiSerMudadoNo.env'; // Usar variável de ambiente

// GET todos os usuários (Pode precisar de middleware de autenticação/autorização)
router.get('/', async (req, res) => {
    try {
        const [usuarios] = await pool.query('SELECT * FROM usuarios');
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
});

// GET usuário por ID (Pode precisar de middleware de autenticação/autorização)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [usuario] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(usuario[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
});

// POST novo usuário (Registro)
// Este é o endpoint para criar usuários que terão acesso ao sistema (funcionários ou futuros alunos com login)
router.post('/register', async (req, res) => { // Alterado para /register para clareza
    const { email, senha, tipo_usuario, id_aluno, id_funcionario } = req.body;

    if (!email || !senha || !tipo_usuario) {
        return res.status(400).json({ message: 'Campos obrigatórios (email, senha, tipo_usuario) ausentes' });
    }

    try {
        // Verificar se o email já existe
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE login = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const [result] = await pool.query(
            'INSERT INTO usuarios (login, senha, tipo_usuario, id_aluno, id_funcionario) VALUES (?, ?, ?, ?, ?)',
            [email, senhaHash, tipo_usuario, id_aluno || null, id_funcionario || null]
        );
        res.status(201).json({ message: 'Usuário criado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
});

// PUT atualizar usuário (Pode precisar de middleware de autenticação/autorização)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { login, senha, tipo_usuario, id_aluno, id_funcionario } = req.body;
    try {
        let senhaHash;
        if (senha) { // Apenas hash se uma nova senha for fornecida
            senhaHash = await bcrypt.hash(senha, 10);
        }

        const query = 'UPDATE usuarios SET login = ?, senha = ?, tipo_usuario = ?, id_aluno = ?, id_funcionario = ? WHERE id_usuario = ?';
        const values = [login, senhaHash, tipo_usuario, id_aluno || null, id_funcionario || null, id];

        await pool.query(query, values);
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
});

// DELETE usuário (Pode precisar de middleware de autenticação/autorização)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
    }
});

// LOGIN de usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Encontrar o usuário pelo email (login)
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE login = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        const usuario = rows[0];

        // 2. Comparar a senha fornecida com a senha hash do banco de dados
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // 3. Gerar token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.login, cargo: usuario.tipo_usuario },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.json({ message: 'Login bem-sucedido', token, cargo: usuario.tipo_usuario });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor durante o login', error: error.message });
    }
});

module.exports = router;