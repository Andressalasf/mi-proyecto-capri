import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, testConnection } from './config/database.js';
import setupModels from './models/index.js';
import authRouter from './routes/auth.routes.js';
import supplierRouter from './routes/supplier.routes.js';
import locationRouter from './routes/location.routes.js';
import staffRouter from './routes/staff.routes.js';
import productRouter from './routes/product.routes.js';
import goatRouter from './routes/goat.routes.js';

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
const port = parseInt(process.env.PORT || 4000);

// Middleware
app.use(cors());
// Aumentar el límite del tamaño para permitir imágenes más grandes (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inicializar la base de datos
const initializeDatabase = async () => {
  try {
    // Probar conexión
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Inicializar modelos
    await setupModels();

    // Sincronizar base de datos (en desarrollo)
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

// Inicializar la base de datos
initializeDatabase();

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

// Rutas de proveedores
app.use('/api', supplierRouter);

// Rutas de ubicaciones
app.use('/api', locationRouter);

// Rutas de empleados
app.use('/api', staffRouter);

// Rutas de productos
app.use('/api', productRouter);

// Rutas de caprinos
app.use('/api', goatRouter);
  
// Manejar posibles errores de puerto ocupado
app.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Puerto ${port} en uso, intentando con el puerto ${port + 1}`);
    setTimeout(() => {
      app.close();
      app.listen(port + 1);
    }, 1000);
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

