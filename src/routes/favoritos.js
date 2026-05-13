const { Router } = require('express')

const verificarToken = require('../middleware/verificarToken')

const {
  añadirFavorito,
  quitarFavorito,
  listarFavoritos
} = require('../controllers/favoritosController')

const router = Router()

router.use(verificarToken)

router.post('/:peliculaId', añadirFavorito)
router.delete('/:peliculaId', quitarFavorito)
router.get('/', listarFavoritos)

module.exports = router