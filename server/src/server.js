const app = require('./app');
const env = require('./config/env');
const { initDB } = require('./config/database');

const start = async () => {
  try {
    await initDB();
    app.listen(env.port, () => {
      console.log(`🚀 API lista en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor', error);
    process.exit(1);
  }
};

start();
