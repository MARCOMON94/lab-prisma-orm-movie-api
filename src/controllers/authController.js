const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
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

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email: emailNormalizado
      }
    })

    if (usuarioExistente) {
      throw new AppError('Ya existe un usuario con ese email', 409)
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email: emailNormalizado,
        passwordHash,
        rol: rol === 'admin' ? 'admin' : 'usuario'
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    })

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token: generarToken(usuario),
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

    const usuario = await prisma.usuario.findFirst({
      where: {
        email: emailNormalizado,
        activo: true
      }
    })

    if (!usuario) {
      throw new AppError('Credenciales incorrectas', 401)
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash)

    if (!passwordValida) {
      throw new AppError('Credenciales incorrectas', 401)
    }

    res.json({
      mensaje: 'Login correcto',
      token: generarToken(usuario),
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
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.usuario.id
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true
      }
    })

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404)
    }

    res.json(usuario)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registro,
  login,
  perfil
}