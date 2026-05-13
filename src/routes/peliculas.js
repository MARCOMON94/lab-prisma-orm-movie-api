const { Router } = require('express')

const {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  listarResenas,
  crearResena
} = require('../controllers/peliculasController')

const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')

const router = Router()

router.get('/:id/resenas', listarResenas)
router.post('/:id/resenas', verificarToken, crearResena)

router.get('/', listarPeliculas)
router.get('/:id', obtenerPelicula)

router.post('/', verificarToken, crearPelicula)
router.put('/:id', verificarToken, verificarRol('admin'), actualizarPelicula)
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarPelicula)

module.exports = router