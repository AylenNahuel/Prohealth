const insurancesService = require('../services/insurances.service');

const list = async (_req, res) => {
  const items = await insurancesService.list();
  res.json(items);
};

const create = async (req, res) => {
  const insurance = await insurancesService.create({
    id: req.body.id,
    nombre: req.body.nombre,
  });
  res.status(201).json(insurance);
};

const update = async (req, res) => {
  const insurance = await insurancesService.update(req.params.id.toLowerCase(), req.body.nombre);
  res.json(insurance);
};

const remove = async (req, res) => {
  await insurancesService.remove(req.params.id.toLowerCase());
  res.status(204).send();
};

module.exports = {
  list,
  create,
  update,
  remove,
};
