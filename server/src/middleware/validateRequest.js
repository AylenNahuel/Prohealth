const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      createError(422, 'Solicitud inválida', {
        details: errors.array(),
      })
    );
  }
  return next();
};

module.exports = validateRequest;
