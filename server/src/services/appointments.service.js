const createError = require('http-errors');
const { getPool } = require('../config/database');
const APPOINTMENT_STATUS = require('../constants/appointmentStatus');
const { sendAppointmentNotification } = require('./email.service');

const baseSelect = `
  SELECT
    a.Id AS id,
    a.PatientName AS patientName,
    a.Phone AS phone,
    a.Email AS email,
    a.InsuranceId AS insuranceId,
    i.Nombre AS insuranceName,
    a.SlotDate AS slotISO,
    a.Status AS status,
    a.Notes AS notes,
    a.CreatedAt AS createdAt
  FROM Appointments a
  INNER JOIN Insurances i ON i.Id = a.InsuranceId
`;

const normalizeDate = (value) => (value instanceof Date ? value.toISOString() : value);

const mapRecord = (record) => ({
  id: record.id,
  patientName: record.patientName,
  phone: record.phone,
  email: record.email,
  insuranceId: record.insuranceId,
  insuranceName: record.insuranceName,
  slotISO: normalizeDate(record.slotISO),
  notes: record.notes,
  status: record.status,
  createdAt: normalizeDate(record.createdAt),
});

const toMySQLDate = (value) => (value ? new Date(value) : null);

const list = async ({ status, search, startDate, endDate }) => {
  const pool = await getPool();
  const conditions = [];
  const values = [];

  if (status) {
    conditions.push('a.Status = ?');
    values.push(status);
  }

  const searchTerm = search?.trim().toLowerCase();
  if (searchTerm) {
    conditions.push('(LOWER(a.PatientName) LIKE ? OR LOWER(a.Email) LIKE ?)');
    values.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  if (startDate) {
    conditions.push('a.SlotDate >= ?');
    values.push(toMySQLDate(startDate));
  }

  if (endDate) {
    conditions.push('a.SlotDate <= ?');
    values.push(toMySQLDate(endDate));
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.execute(`${baseSelect} ${whereClause} ORDER BY a.SlotDate ASC`, values);
  return rows.map(mapRecord);
};

const findById = async (id) => {
  const pool = await getPool();
  const [rows] = await pool.execute(`${baseSelect} WHERE a.Id = ?`, [id]);
  return rows[0] ? mapRecord(rows[0]) : null;
};

const ensureSlotAvailable = async (slotISO) => {
  const pool = await getPool();
  const [rows] = await pool.execute(
    'SELECT COUNT(1) AS total FROM Appointments WHERE SlotDate = ? AND Status <> ?',
    [toMySQLDate(slotISO), APPOINTMENT_STATUS.CANCELLED]
  );
  const count = rows[0]?.total || 0;
  if (count > 0) {
    throw createError(409, 'Ese horario ya no está disponible.');
  }
};

const create = async ({ patientName, phone, email, insuranceId, slotISO, notes = null }) => {
  await ensureSlotAvailable(slotISO);
  const pool = await getPool();
  const [result] = await pool.execute(
    `INSERT INTO Appointments (PatientName, Phone, Email, InsuranceId, SlotDate, Notes, Status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patientName, phone, email, insuranceId, toMySQLDate(slotISO), notes, APPOINTMENT_STATUS.REQUESTED]
  );
  const appointment = await findById(result.insertId);

  try {
    await sendAppointmentNotification(appointment);
  } catch (error) {
    console.error('[email] Error al enviar notificación de turno', error);
  }

  return appointment;
};

const updateStatus = async ({ id, status }) => {
  const pool = await getPool();
  const [result] = await pool.execute(
    'UPDATE Appointments SET Status = ?, UpdatedAt = UTC_TIMESTAMP() WHERE Id = ?',
    [status, id]
  );
  if (result.affectedRows === 0) {
    throw createError(404, 'Turno no encontrado.');
  }
  return findById(id);
};

const remove = async (id) => {
  const pool = await getPool();
  const [result] = await pool.execute('DELETE FROM Appointments WHERE Id = ?', [id]);
  if (result.affectedRows === 0) {
    throw createError(404, 'Turno no encontrado.');
  }
};

module.exports = {
  list,
  create,
  findById,
  updateStatus,
  remove,
};
