const mysql = require('mysql2/promise');
const env = require('./env');

let pool;

const createPool = () =>
  mysql.createPool({
    host: env.db.server,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: false,
    timezone: 'Z',
    ssl: env.db.ssl ? {} : undefined,
  });

const initDB = async () => {
  if (!pool) {
    pool = createPool();
    try {
      await pool.query('SELECT 1');
      console.info('✅ Connected to MySQL');
    } catch (error) {
      pool = null;
      console.error('❌ MySQL connection error', error);
      throw error;
    }
  }
  return pool;
};

const getPool = async () => initDB();

module.exports = {
  initDB,
  getPool,
};
