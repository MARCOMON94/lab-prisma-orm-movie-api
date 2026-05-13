require('dotenv').config()

const { Pool } = require('pg')

const databaseName =
  process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_NAME || 'peliculas_test'
    : process.env.DB_NAME || 'peliculas_db'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: databaseName,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

if (process.env.NODE_ENV !== 'test') {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error al conectar a PostgreSQL:', err.message)
      process.exit(1)
    }

    release()
    console.log('Conectado a PostgreSQL - Base de datos:', databaseName)
  })
}

module.exports = pool