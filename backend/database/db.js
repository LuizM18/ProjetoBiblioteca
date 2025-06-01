// backend/database/db.js
const mysql = require('mysql2/promise'); // Usar o módulo promise para async/await
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Limite de conexões no pool
    queueLimit: 0
});

// Testar a conexão ao iniciar
pool.getConnection()
    .then(connection => {
        console.log('Conectado ao banco de dados MySQL via Pool.');
        connection.release(); // Liberar a conexão de teste
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Encerrar a aplicação se não conseguir conectar ao DB
    });

module.exports = pool; // Exportar o pool