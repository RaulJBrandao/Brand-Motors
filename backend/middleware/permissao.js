module.exports = function (...cargosPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (!cargosPermitidos.includes(req.usuario.cargo)) {
      return res.status(403).json({ erro: "Acesso negado: permissão insuficiente" });
    }

    next();
  };
};
