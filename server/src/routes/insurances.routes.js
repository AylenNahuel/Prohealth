const express = require('express');
const { body, param } = require('express-validator');
const insurancesController = require('../controllers/insurances.controller');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', asyncHandler(insurancesController.list));

router.post(
  '/',
  auth,
  [
    body('id').isLength({ min: 2 }).withMessage('El ID debe tener al menos 2 caracteres.').trim().toLowerCase(),
    body('nombre').isLength({ min: 3 }).withMessage('Ingrese un nombre válido.').trim(),
    validateRequest,
  ],
  asyncHandler(insurancesController.create)
);

router.put(
  '/:id',
  auth,
  [
    param('id').notEmpty().withMessage('ID requerido.').trim().toLowerCase(),
    body('nombre').isLength({ min: 3 }).withMessage('Ingrese un nombre válido.').trim(),
    validateRequest,
  ],
  asyncHandler(insurancesController.update)
);

router.delete(
  '/:id',
  auth,
  [param('id').notEmpty().withMessage('ID requerido.').trim().toLowerCase(), validateRequest],
  asyncHandler(insurancesController.remove)
);

module.exports = router;
