import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import setupModels from '../models/index.js';

dotenv.config();

// Configuración de la conexión a la base de datos
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'granme',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'admin123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: console.log,
    dialectOptions: {
      ssl: false
    }
  }
);

// Inicializar modelos
setupModels(sequelize);

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
};

export default sequelize;

