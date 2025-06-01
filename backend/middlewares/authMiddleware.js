// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'umSegredoMuitoSecretoEVaiSerMudadoNo.env';

function verificaToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido (Authorization header ausente)' });
    }

    const token = authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Renomeado para req.user para consistência com verificaAdmin
        next();
    } catch (err) {
        console.error('Erro de validação de token:', err);
        // Retornar 403 para token inválido ou expirado
        return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
}

module.exports = verificaToken;