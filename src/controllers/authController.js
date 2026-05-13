const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const AppError = require('../utils/AppError')

const SALT_ROUNDS = 10

const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  )
}

const registro = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body

    if (!nombre || !email || !password) {
      throw new AppError('nombre, email y password son obligatorios', 400)
    }

    if (password.length < 6) {
      throw new AppError('La contraseña debe tener al menos 6 caracteres', 400)
    }

    const emailNormalizado = email.toLowerCase()

    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [emailNormalizado]
    )

    if (usuarioExistente.rows.length > 0) {
      throw new AppError('Ya existe un usuario con ese email', 409)
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const rolFinal = rol === 'admin' ? 'admin' : 'usuario'

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, created_at`,
      [nombre, emailNormalizado, passwordHash, rolFinal]
    )

    const usuario = resultado.rows[0]
    const token = generarToken(usuario)

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('email y password son obligatorios', 400)
    }

    const emailNormalizado = email.toLowerCase()

    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND activo = true',
      [emailNormalizado]
    )

    if (resultado.rows.length === 0) {
      throw new AppError('Credenciales incorrectas', 401)
    }

    const usuario = resultado.rows[0]

    const passwordValida = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordValida) {
      throw new AppError('Credenciales incorrectas', 401)
    }

    const token = generarToken(usuario)

    res.json({
      mensaje: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    })
  } catch (err) {
    next(err)
  }
}

const perfil = async (req, res, next) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nombre, email, rol, created_at
       FROM usuarios
       WHERE id = $1`,
      [req.usuario.id]
    )

    if (resultado.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404)
    }

    res.json(resultado.rows[0])
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registro,
  login,
  perfil
}