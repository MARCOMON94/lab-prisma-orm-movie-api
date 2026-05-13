const AppError = require('../utils/AppError')

const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('Usuario no autenticado', 401))
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403))
    }

    next()
  }
}

module.exports = verificarRol