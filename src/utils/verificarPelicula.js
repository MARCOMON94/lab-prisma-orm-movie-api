const prisma = require('../config/prisma')
const AppError = require('./AppError')

const verificarPeliculaExiste = async (peliculaId) => {
  const pelicula = await prisma.pelicula.findUnique({
    where: {
      id: Number(peliculaId)
    },
    select: {
      id: true
    }
  })

  if (!pelicula) {
    throw new AppError('Película no encontrada', 404)
  }

  return pelicula
}

module.exports = verificarPeliculaExiste