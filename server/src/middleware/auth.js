const createError = require('http-errors');
const { verifyToken } = require('../utils/jwt');

const auth = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token) {
    return next(createError(401, 'Autenticación requerida.'));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(createError(401, 'Token inválido o expirado.'));
  }
};

module.exports = auth;
