const prisma = require('../config/prisma')
const AppError = require('../utils/AppError')
const verificarPeliculaExiste = require('../utils/verificarPelicula')

const añadirFavorito = async (req, res, next) => {
  try {
    const peliculaId = Number(req.params.peliculaId)
    const usuarioId = req.usuario.id

    await verificarPeliculaExiste(peliculaId)

    try {
      const favorito = await prisma.favorito.create({
        data: {
          usuarioId,
          peliculaId
        }
      })

      res.status(201).json({
        ok: true,
        favorito
      })
    } catch (err) {
      if (err.code === 'P2002') {
        throw new AppError('Esta película ya está en tus favoritos', 409)
      }

      throw err
    }
  } catch (err) {
    next(err)
  }
}

const quitarFavorito = async (req, res, next) => {
  try {
    const peliculaId = Number(req.params.peliculaId)
    const usuarioId = req.usuario.id

    const favorito = await prisma.favorito.findUnique({
      where: {
        usuarioId_peliculaId: {
          usuarioId,
          peliculaId
        }
      }
    })

    if (!favorito) {
      throw new AppError('Favorito no encontrado', 404)
    }

    await prisma.favorito.delete({
      where: {
        usuarioId_peliculaId: {
          usuarioId,
          peliculaId
        }
      }
    })

    res.json({
      ok: true,
      mensaje: 'Eliminado de favoritos'
    })
  } catch (err) {
    next(err)
  }
}

const listarFavoritos = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const favoritos = await prisma.favorito.findMany({
      where: {
        usuarioId
      },
      include: {
        pelicula: {
          select: {
            id: true,
            titulo: true,
            anio: true,
            nota: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const respuesta = favoritos.map((favorito) => ({
      id: favorito.pelicula.id,
      titulo: favorito.pelicula.titulo,
      anio: favorito.pelicula.anio,
      nota: favorito.pelicula.nota,
      añadido_en: favorito.createdAt
    }))

    res.json(respuesta)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  añadirFavorito,
  quitarFavorito,
  listarFavoritos
}