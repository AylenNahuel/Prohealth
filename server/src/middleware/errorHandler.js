const env = require('../config/env');

const errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || 'Error inesperado',
  };

  if (env.nodeEnv !== 'production') {
    payload.stack = err.stack;
    payload.details = err.details;
  }

  res.status(status).json(payload);
};

module.exports = errorHandler;
