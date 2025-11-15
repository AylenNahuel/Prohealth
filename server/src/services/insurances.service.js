const createError = require('http-errors');
const { getPool } = require('../config/database');

const list = async () => {
  const pool = await getPool();
  const [rows] = await pool.execute('SELECT Id AS id, Nombre AS nombre, CreatedAt AS createdAt FROM Insurances ORDER BY Nombre ASC');
  return rows;
};

const exists = async (id) => {
  const normalizedId = id.trim().toLowerCase();
  const pool = await getPool();
  const [rows] = await pool.execute('SELECT COUNT(1) AS total FROM Insurances WHERE Id = ?', [normalizedId]);
  return rows[0].total > 0;
};

const create = async ({ id, nombre }) => {
  const normalizedId = id.trim().toLowerCase();
  const displayName = nombre.trim();
  if (await exists(normalizedId)) {
    throw createError(409, 'El ID ya existe.');
  }
  const pool = await getPool();
  await pool.execute('INSERT INTO Insurances (Id, Nombre) VALUES (?, ?)', [normalizedId, displayName]);
  const [rows] = await pool.execute('SELECT Id AS id, Nombre AS nombre, CreatedAt AS createdAt FROM Insurances WHERE Id = ?', [normalizedId]);
  return rows[0];
};

const update = async (id, nombre) => {
  const normalizedId = id.trim().toLowerCase();
  const displayName = nombre.trim();
  const pool = await getPool();
  const [result] = await pool.execute('UPDATE Insurances SET Nombre = ?, UpdatedAt = UTC_TIMESTAMP() WHERE Id = ?', [displayName, normalizedId]);
  if (result.affectedRows === 0) {
    throw createError(404, 'Obra social no encontrada.');
  }
  const [rows] = await pool.execute('SELECT Id AS id, Nombre AS nombre, UpdatedAt AS updatedAt FROM Insurances WHERE Id = ?', [normalizedId]);
  return rows[0];
};

const remove = async (id) => {
  const normalizedId = id.trim().toLowerCase();
  const pool = await getPool();
  const [result] = await pool.execute('DELETE FROM Insurances WHERE Id = ?', [normalizedId]);
  if (result.affectedRows === 0) {
    throw createError(404, 'Obra social no encontrada.');
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
};
