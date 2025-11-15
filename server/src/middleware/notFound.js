const createError = require('http-errors');

const notFound = (req, _res, next) => {
  next(createError(404, `Ruta ${req.originalUrl} no encontrada`));
};

module.exports = notFound;
