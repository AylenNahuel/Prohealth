const express = require('express');
const authRoutes = require('./auth.routes');
const appointmentsRoutes = require('./appointments.routes');
const insurancesRoutes = require('./insurances.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/insurances', insurancesRoutes);

module.exports = router;
