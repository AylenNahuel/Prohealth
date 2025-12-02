const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const toBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === true || value === 'true' || value === '1';
};

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 4000),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  jwt: {
    secret: process.env.JWT_SECRET || 'local-dev-secret',
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  },
  db: {
    server: process.env.DB_SERVER || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'ProHealth',
    ssl: toBool(process.env.DB_SSL, false),
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
  },
};

module.exports = env;
