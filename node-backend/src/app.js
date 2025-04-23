import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import setupModels from './models/index.js';
import authRouter from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para el archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Mostrar configuración
console.log('Configuración de base de datos:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
// No mostrar la contraseña completa por seguridad
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'no definida');

const app = express(); 

// Puerto de la aplicación
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
// Aumentar el límite del tamaño para permitir imágenes más grandes (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'granme',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'admin123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: console.log,
    dialectOptions: {
      // Para mostrar errores más detallados
      ssl: false
    }
  }
);

// Probar conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Inicializar modelos
    setupModels(sequelize);

    // Sincronizar base de datos (en desarrollo)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
  })
  .catch(error => {
    console.error('Error al conectar con la base de datos:', error);
    console.error('Detalles adicionales:', JSON.stringify(error, null, 2));
  });

// Rutas
app.get('/', (req, res) => {
  res.send('Backend con NodeJS - Express + API REST + PostgreSQL');
}); 

// Ruta de prueba
app.post('/api/test', (req, res) => {
  console.log('Recibida solicitud de prueba:', req.body);
  res.status(200).json({ 
    message: 'Solicitud recibida correctamente', 
    data: req.body 
  });
});

// Rutas de autenticación
app.use('/api', authRouter);
  
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

