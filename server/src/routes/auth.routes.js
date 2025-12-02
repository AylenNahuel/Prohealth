const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    validateRequest,
  ],
  asyncHandler(authController.login)
);

module.exports = router;
