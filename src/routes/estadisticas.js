const { Router } = require('express')

const {
  obtenerEstadisticas,
  estadisticasDirectores,
  estadisticasGeneros
} = require('../controllers/peliculasController')

const router = Router()

router.get('/', obtenerEstadisticas)
router.get('/directores', estadisticasDirectores)
router.get('/generos', estadisticasGeneros)

module.exports = router