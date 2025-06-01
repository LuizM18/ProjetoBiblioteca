const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:5173', // A porta do seu frontend (Vite)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Configuração do Pool de Conexões MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão com o banco de dados
pool.getConnection()
    .then(connection => {
        console.log('Conectado ao banco de dados MySQL via Pool.');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra a aplicação se não conseguir conectar
    });

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona o payload do token ao objeto req.user
        next();
    } catch (error) {
        console.error("Erro na verificação do token:", error);
        res.status(403).json({ message: "Token inválido ou expirado." });
    }
};

// Middleware para verificar o cargo do usuário
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.cargo) {
            return res.status(403).json({ message: "Informações de cargo ausentes no token." });
        }
        if (!allowedRoles.includes(req.user.cargo)) {
            return res.status(403).json({ message: "Acesso negado. Você não tem permissão para realizar esta ação." });
        }
        next();
    };
};

// --- ROTAS DE AUTENTICAÇÃO E USUÁRIOS ---

// Rota de Login
app.post("/api/usuarios/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await pool.execute('SELECT id_usuario, login, senha, tipo_usuario FROM usuarios WHERE login = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas. Usuário não encontrado." });
        }

        const user = rows[0];

        // --- VERIFICAÇÃO DE SENHA COM BCRYPT (CORRIGIDO PARA PRODUÇÃO) ---
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        // --- FIM DA VERIFICAÇÃO ---

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas. Senha incorreta." });
        }

        const token = jwt.sign(
            { id: user.id_usuario, login: user.login, cargo: user.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.status(200).json({ message: "Login bem-sucedido!", token, cargo: user.tipo_usuario });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro interno do servidor durante o login." });
    }
});

// --- ROTA PÚBLICA: Auto-cadastro de Aluno (cria aluno e usuário de login) ---
app.post("/api/alunos/register", async (req, res) => {
    const { nome, email, matricula, turma, senha } = req.body;

    if (!nome || !email || !matricula || !turma || !senha) {
        return res.status(400).json({ message: "Nome, email, matrícula, turma e senha são obrigatórios." });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Inserir na tabela alunos
        const [alunoResult] = await connection.execute(
            'INSERT INTO alunos (nome, email, matricula, turma) VALUES (?, ?, ?, ?)',
            [nome, email, matricula, turma]
        );
        const id_aluno = alunoResult.insertId;

        // 2. Criar conta de usuário (hashed password)
        const hashedPassword = await bcrypt.hash(senha, 10);
        const [userResult] = await connection.execute(
            'INSERT INTO usuarios (login, senha, tipo_usuario, id_aluno) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, 'aluno', id_aluno]
        );

        await connection.commit();
        res.status(201).json({ message: "Aluno e conta de usuário criados com sucesso!", id: id_aluno });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Erro ao auto-cadastrar aluno e usuário:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Matrícula ou email já cadastrado. Por favor, verifique seus dados ou tente fazer login." });
        }
        res.status(500).json({ message: "Erro interno do servidor ao auto-cadastrar aluno e usuário." });
    } finally {
        if (connection) connection.release();
    }
});

// --- ROTAS PROTEGIDAS POR ADMIN ---

// Rota de Cadastro de Livro (APENAS para Administradores)
app.post("/api/livros", verifyToken, verifyRole(['administrador']), async (req, res) => {
    const { titulo, autor, editora, ano_publicacao, isbn, id_categoria, link_trailer_youtube, url_capa, url_pdf, nova_categoria_nome } = req.body;

    if (!titulo || !autor || !ano_publicacao) {
        return res.status(400).json({ message: "Título, autor e ano de publicação são obrigatórios." });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        let final_id_categoria = id_categoria ? parseInt(id_categoria, 10) : null;

        // Se uma nova categoria foi fornecida (e não uma existente selecionada)
        if (nova_categoria_nome && nova_categoria_nome.trim() !== '' && !final_id_categoria) {
            // Verificar se a categoria já existe
            const [existingCategory] = await connection.execute('SELECT id_categoria FROM categorias WHERE nome = ?', [nova_categoria_nome]);
            if (existingCategory.length > 0) {
                final_id_categoria = existingCategory[0].id_categoria;
            } else {
                // Se não existe, inserir a nova categoria
                const [newCategoryResult] = await connection.execute('INSERT INTO categorias (nome) VALUES (?)', [nova_categoria_nome]);
                final_id_categoria = newCategoryResult.insertId;
            }
        }

        const [result] = await connection.execute(
            'INSERT INTO livros (titulo, autor, editora, ano_publicacao, isbn, id_categoria, link_trailer_youtube, url_capa, url_pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [titulo, autor, editora, ano_publicacao, isbn, final_id_categoria, link_trailer_youtube || null, url_capa || null, url_pdf || null]
        );

        await connection.commit();
        res.status(201).json({ message: "Livro cadastrado com sucesso!", id: result.insertId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Erro ao cadastrar livro:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "ISBN já cadastrado ou outra entrada duplicada. Verifique os dados." });
        }
        res.status(500).json({ message: "Erro interno do servidor ao cadastrar livro." });
    } finally {
        if (connection) connection.release();
    }
});

// Rota para listar TODOS os livros (acessível por qualquer usuário logado)
// AGORA COM FUNCIONALIDADE DE BUSCA!
app.get("/api/livros", verifyToken, async (req, res) => {
    const searchTerm = req.query.search; // Pega o termo de busca da query
    let query = 'SELECT l.id_livro, l.titulo, l.autor, l.editora, l.ano_publicacao, l.isbn, l.link_trailer_youtube, l.url_capa, l.url_pdf, c.nome AS categoria_nome FROM livros l LEFT JOIN categorias c ON l.id_categoria = c.id_categoria';
    let params = [];

    if (searchTerm) {
        query += ' WHERE l.titulo LIKE ? OR l.autor LIKE ? OR l.editora LIKE ?';
        params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
    }
    query += ' ORDER BY l.titulo'; // Adicionado ORDER BY

    try {
        const [rows] = await pool.execute(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar livros." });
    }
});

// Rota para EXCLUIR um livro por ID (APENAS para Administradores)
app.delete("/api/livros/:id", verifyToken, verifyRole(['administrador']), async (req, res) => {
    const { id } = req.params; // Pega o ID do livro da URL

    try {
        const [result] = await pool.execute('DELETE FROM livros WHERE id_livro = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }

        res.status(200).json({ message: "Livro excluído com sucesso!" });

    } catch (error) {
        console.error("Erro ao excluir livro:", error);
        res.status(500).json({ message: "Erro interno do servidor ao excluir livro." });
    }
});

// Rota para LISTAR Funcionários (APENAS para Administradores e Funcionários)
app.get("/api/funcionarios", verifyToken, verifyRole(['administrador', 'funcionario']), async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id_funcionario, nome, email, telefone, cargo FROM funcionarios ORDER BY nome');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar funcionários." });
    }
});

// Rota de Cadastro de Funcionário (APENAS para Administradores)
app.post("/api/funcionarios", verifyToken, verifyRole(['administrador']), async (req, res) => {
    const { nome, email, telefone, cargo, senha } = req.body;

    if (!nome || !email || !cargo || !senha) {
        return res.status(400).json({ message: "Nome, email, cargo e senha são obrigatórios." });
    }
    if (!['funcionario', 'administrador'].includes(cargo)) { // Admin pode criar 'funcionario' ou 'administrador'
        return res.status(400).json({ message: "Cargo inválido. Escolha 'funcionario' ou 'administrador'." });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Inserir na tabela funcionarios
        const [funcionarioResult] = await connection.execute(
            'INSERT INTO funcionarios (nome, email, telefone, cargo) VALUES (?, ?, ?, ?)',
            [nome, email, telefone, cargo]
        );
        const id_funcionario = funcionarioResult.insertId;

        // 2. Criar conta de usuário (hashed password)
        const hashedPassword = await bcrypt.hash(senha, 10);
        const [userResult] = await connection.execute(
            'INSERT INTO usuarios (login, senha, tipo_usuario, id_funcionario) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, cargo, id_funcionario]
        );

        await connection.commit();
        res.status(201).json({ message: "Funcionário e conta de usuário criados com sucesso!", id: id_funcionario });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Erro ao cadastrar funcionário e usuário:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Email já cadastrado para funcionário ou usuário." });
        }
        res.status(500).json({ message: "Erro interno do servidor ao cadastrar funcionário e usuário." });
    } finally {
        if (connection) connection.release();
    }
});

// NOVA ROTA: Excluir Funcionário por ID (APENAS para Administradores)
app.delete("/api/funcionarios/:id", verifyToken, verifyRole(['administrador']), async (req, res) => {
    const { id } = req.params; // id do funcionário

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Encontrar o usuário associado a este funcionário (se existir)
        const [userRows] = await connection.execute('SELECT id_usuario FROM usuarios WHERE id_funcionario = ?', [id]);
        const id_usuario = userRows.length > 0 ? userRows[0].id_usuario : null;

        // 2. Deletar o usuário associado (se encontrado)
        if (id_usuario) {
            await connection.execute('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        }

        // 3. Deletar o funcionário
        const [result] = await connection.execute('DELETE FROM funcionarios WHERE id_funcionario = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback(); // Faz rollback se o funcionário não foi encontrado
            return res.status(404).json({ message: "Funcionário não encontrado." });
        }

        await connection.commit();
        res.status(200).json({ message: "Funcionário e usuário associado excluídos com sucesso!" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Erro ao excluir funcionário:", error);
        res.status(500).json({ message: "Erro interno do servidor ao excluir funcionário." });
    } finally {
        if (connection) connection.release();
    }
});


// Rota de Cadastro de Aluno (APENAS para Administradores - não cria login automaticamente)
app.post("/api/alunos", verifyToken, verifyRole(['administrador']), async (req, res) => {
    const { nome, email, matricula, data_nascimento, serie, turma } = req.body;

    if (!nome || !matricula) {
        return res.status(400).json({ message: "Nome e matrícula são obrigatórios." });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO alunos (nome, email, matricula, data_nascimento, serie, turma) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, email, matricula, data_nascimento, serie, turma]
        );
        res.status(201).json({ message: "Aluno cadastrado com sucesso!", id: result.insertId });
    } catch (error) {
        console.error("Erro ao cadastrar aluno (admin):", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Matrícula ou email já cadastrado." });
        }
        res.status(500).json({ message: "Erro interno do servidor ao cadastrar aluno." });
    }
});

// NOVA ROTA: Excluir Aluno por ID (APENAS para Administradores)
app.delete("/api/alunos/:id", verifyToken, verifyRole(['administrador']), async (req, res) => {
    const { id } = req.params; // id do aluno

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Encontrar o usuário associado a este aluno (se existir)
        const [userRows] = await connection.execute('SELECT id_usuario FROM usuarios WHERE id_aluno = ?', [id]);
        const id_usuario = userRows.length > 0 ? userRows[0].id_usuario : null;

        // 2. Deletar o usuário associado (se encontrado)
        if (id_usuario) {
            await connection.execute('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        }

        // 3. Deletar o aluno
        const [result] = await connection.execute('DELETE FROM alunos WHERE id_aluno = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback(); // Faz rollback se o aluno não foi encontrado
            return res.status(404).json({ message: "Aluno não encontrado." });
        }

        await connection.commit();
        res.status(200).json({ message: "Aluno e usuário associado excluídos com sucesso!" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Erro ao excluir aluno:", error);
        res.status(500).json({ message: "Erro interno do servidor ao excluir aluno." });
    } finally {
        if (connection) connection.release();
    }
});


// Rota para listar Categorias (útil para o dropdown de cadastro de livros)
app.get("/api/categorias", verifyToken, verifyRole(['administrador', 'funcionario']), async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id_categoria, nome FROM categorias ORDER BY nome');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ message: "Erro interno do servidor ao buscar categorias." });
    }
});


// Inicia o servidor
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});