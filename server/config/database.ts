// src/config/db.ts
import { Pool } from "pg";

// Configurar el pool de conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  password: "salas",
  host: "localhost",
  port: 5432,
  database: "granme", // Aquí debe estar el nombre real de la base de datos existente
});

// Crear la tabla USUARIOS si no existe
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40),
    surname VARCHAR(40) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
const createTable = async () => {
  try {
    const result = await pool.query(createTableQuery);
    console.log("✅ Tabla USUARIOS creada o ya existe.");
    console.log(result.command); // 'CREATE' o 'CREATE TABLE'
  } catch (error) {
    console.error("❌ Error al crear la tabla:");
    console.error(error);
  }
};

createTable();

export default pool;
