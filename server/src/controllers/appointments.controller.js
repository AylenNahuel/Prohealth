const appointmentsService = require('../services/appointments.service');

const list = async (req, res) => {
  const { status, search, startDate, endDate } = req.query;
  const appointments = await appointmentsService.list({
    status,
    search,
    startDate,
    endDate,
  });
  res.json(appointments);
};

const create = async (req, res) => {
  const appointment = await appointmentsService.create(req.body);
  res.status(201).json(appointment);
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  const updated = await appointmentsService.updateStatus({
    id: Number(req.params.id),
    status,
  });
  res.json(updated);
};

const remove = async (req, res) => {
  await appointmentsService.remove(Number(req.params.id));
  res.status(204).send();
};

module.exports = {
  list,
  create,
  updateStatus,
  remove,
};
