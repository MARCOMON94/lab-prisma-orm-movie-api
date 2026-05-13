require('dotenv').config()

const express = require('express')

const peliculasRouter = require('./src/routes/peliculas')
const authRouter = require('./src/routes/auth')
//const estadisticasRouter = require('./src/routes/estadisticas')
const errorHandler = require('./src/middleware/errorHandler')
const favoritosRouter = require('./src/routes/favoritos')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/peliculas', peliculasRouter)
//app.use('/api/estadisticas', estadisticasRouter)
app.use('/api/favoritos', favoritosRouter)

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de películas funcionando',
    rutas: [
  'GET /api/peliculas',
  'GET /api/peliculas/:id',
  'POST /api/peliculas',
  'PUT /api/peliculas/:id',
  'DELETE /api/peliculas/:id',
  'GET /api/peliculas/:id/resenas',
  'POST /api/peliculas/:id/resenas',
  'GET /api/estadisticas',
  'GET /api/estadisticas/directores',
  'GET /api/estadisticas/generos',
  'GET /api/favoritos',
  'POST /api/favoritos/:peliculaId',
  'DELETE /api/favoritos/:peliculaId'
]
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: `Ruta ${req.method} ${req.url} no encontrada`
  })
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
  })
}

module.exports = app