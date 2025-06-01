// middlewares/verificaAdmin.js
function verificaAdmin(req, res, next) {
  if (req.user && req.user.cargo === 'administrador') {
    return next();
  } else {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem executar esta ação." });
  }
}

module.exports = verificaAdmin;
