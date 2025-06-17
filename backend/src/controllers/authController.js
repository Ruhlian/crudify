const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  successResponse(res, {
    token,
    user: {
      id: user._id,
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      cargo: user.cargo,
      sede: user.sede,
      gerencia: user.gerencia,
      rol: user.rol
    }
  }, message, statusCode);
};

class AuthController {
  static async register(req, res, next) {
    try {
      const { idUsuario, nombre, email, password, cargo, sede, direccion, gerencia, rol } = req.body;

      const [existingId, existingEmail] = await Promise.all([
        User.findOne({ idUsuario }),
        User.findOne({ email: email.toLowerCase() })
      ]);

      if (existingId) {
        return errorResponse(res, 'El ID de usuario ya existe', 400);
      }
      if (existingEmail) {
        return errorResponse(res, 'El email ya está registrado', 400);
      }

      const newUser = await User.create({
        idUsuario,
        nombre,
        email: email.toLowerCase(),
        password,
        cargo,
        sede,
        direccion,
        gerencia,
        rol: rol || 'user'
      });

      newUser.ultimoAcceso = new Date();
      await newUser.save({ validateBeforeSave: false });

      createSendToken(newUser, 201, res, 'Usuario registrado exitosamente');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        return errorResponse(res, errors, 400);
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      console.log('📩 Body recibido en login:', req.body);
      const { email, password } = req.body;
  
      if (!email || !password) {
        console.log('⚠️ Faltan campos: email o password');
        return errorResponse(res, 'Por favor proporciona email y contraseña', 400);
      }
  
      const user = await User.findOne({
        email: email.toLowerCase(),
        activo: true
      }).select('+password');
  
      if (!user) {
        console.log(`🚫 Usuario con email "${email}" no encontrado o inactivo`);
      } else {
        console.log(`✅ Usuario encontrado: ${user.email}`);
      }
  
      const passwordCorrecta = user && await user.comparePassword(password);
      if (!passwordCorrecta) {
        console.log('❌ Contraseña incorrecta');
        return errorResponse(res, 'Email o contraseña incorrectos', 401);
      }
  
      user.ultimoAcceso = new Date();
      await user.save({ validateBeforeSave: false });
      console.log(`🕐 Último acceso actualizado para: ${user.email}`);
  
      createSendToken(user, 200, res, 'Login exitoso');
      console.log('🔐 Token enviado correctamente');
    } catch (error) {
      console.error('💥 Error en login:', error);
      next(error);
    }
  }
  
  static logout(req, res) {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    successResponse(res, null, 'Logout exitoso');
  }

  static async protect(req, res, next) {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return errorResponse(res, 'No has iniciado sesión. Por favor inicia sesión para acceder', 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id).select('+password');
      if (!currentUser) {
        return errorResponse(res, 'El usuario del token ya no existe', 401);
      }

      if (!currentUser.activo) {
        return errorResponse(res, 'Tu cuenta ha sido desactivada. Contacta al administrador', 401);
      }

      req.user = currentUser;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Token inválido. Por favor inicia sesión nuevamente', 401);
      } else if (error.name === 'TokenExpiredError') {
        return errorResponse(res, 'Tu token ha expirado. Por favor inicia sesión nuevamente', 401);
      }
      next(error);
    }
  }

  static restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.rol)) {
        return errorResponse(res, 'No tienes permisos para realizar esta acción', 403);
      }
      next();
    };
  }

  static async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id)
        .populate({
          path: 'equiposAsignados',
          populate: {
            path: 'equipo',
            select: 'tipoEquipo marca modelo serial estado'
          }
        });

      successResponse(res, user, 'Usuario obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return errorResponse(res, 'No token provided', 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.activo) {
        return errorResponse(res, 'Usuario no válido', 401);
      }

      successResponse(res, {
        valid: true,
        user: {
          id: user._id,
          idUsuario: user.idUsuario,
          nombre: user.nombre,
          email: user.email,
          cargo: user.cargo,
          sede: user.sede,
          gerencia: user.gerencia,
          rol: user.rol
        }
      }, 'Token válido');
    } catch (error) {
      return errorResponse(res, 'Token inválido', 401);
    }
  }
}

module.exports = AuthController;
