const express = require('express');
const { body, param, query } = require('express-validator');
const appointmentsController = require('../controllers/appointments.controller');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  [
    query('status').optional().isIn(['SOLICITADA', 'CONFIRMADA', 'CANCELADA']),
    query('search').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    validateRequest,
  ],
  asyncHandler(appointmentsController.list)
);

router.post(
  '/',
  [
    body('patientName').isLength({ min: 3 }).withMessage('Ingrese un nombre válido.'),
    body('phone').isLength({ min: 6 }).withMessage('Ingrese un teléfono válido.'),
    body('email').isEmail().withMessage('Ingrese un email válido.').normalizeEmail(),
    body('insuranceId').isLength({ min: 2 }).withMessage('Seleccione una obra social.'),
    body('slotISO').isISO8601().withMessage('Seleccione un horario válido.'),
    validateRequest,
  ],
  asyncHandler(appointmentsController.create)
);

router.patch(
  '/:id/status',
  auth,
  [
    param('id').isInt({ min: 1 }).withMessage('ID inválido.'),
    body('status').isIn(['SOLICITADA', 'CONFIRMADA', 'CANCELADA']).withMessage('Estado inválido.'),
    validateRequest,
  ],
  asyncHandler(appointmentsController.updateStatus)
);

router.delete(
  '/:id',
  auth,
  [param('id').isInt({ min: 1 }).withMessage('ID inválido.'), validateRequest],
  asyncHandler(appointmentsController.remove)
);

module.exports = router;
