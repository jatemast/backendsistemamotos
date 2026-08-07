require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexion a MySQL establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`🚀 API Taller de Motos Pavas corriendo en el puerto ${PORT}`);
      console.log(`   Documentacion rapida: GET /api/health`);
    });
  } catch (error) {
    console.error('❌ No fue posible conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

start();
