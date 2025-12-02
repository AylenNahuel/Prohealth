const createError = require('http-errors');
const { getPool } = require('../config/database');
const { comparePassword } = require('../utils/password');

const findByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const pool = await getPool();
  const [rows] = await pool.execute(
    'SELECT Id AS id, Email AS email, FullName AS fullName, Role AS role, PasswordHash AS passwordHash FROM AdminUsers WHERE LOWER(Email) = ? LIMIT 1',
    [normalizedEmail]
  );
  return rows[0];
};

const authenticate = async (email, password) => {
  const user = await findByEmail(email);
  if (!user) {
    throw createError(401, 'Credenciales inválidas.');
  }
  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    throw createError(401, 'Credenciales inválidas.');
  }
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

module.exports = {
  authenticate,
};
