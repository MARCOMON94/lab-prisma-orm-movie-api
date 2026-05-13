const { Router } = require('express')

const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

const {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena
} = require('../controllers/peliculasPrismaController')

const router = Router()

router.get('/', listarPeliculas)

router.get('/:id/resenas', listarResenas)
router.post('/:id/resenas', verificarToken, crearResena)

router.get('/:id', obtenerPelicula)
router.post('/', verificarToken, verificarRol('admin'), crearPelicula)
router.put('/:id', verificarToken, verificarRol('admin'), actualizarPelicula)
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarPelicula)

module.exports = router