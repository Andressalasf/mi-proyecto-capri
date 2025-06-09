# Sistema de Gestión Caprina

## Descripción
Este software es una solución integral para la gestión de una unidad productiva caprina. Permite administrar inventario, personal, ventas, proveedores, animales, reportes y notificaciones, integrando tanto el frontend (Next.js + React) como el backend (Node.js + Express + Sequelize).

## Requerimientos
- Node.js >= 18.x
- npm >= 9.x
- Base de datos relacional ( PostgreSQL)

## Instalación y Despliegue

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd mi-proyecto-capri
```

### 2. Configuración del Backend
1. Ir a la carpeta `node-backend`:
   ```bash
   cd node-backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env` y completar los datos de conexión a la base de datos y JWT.
4. Ejecutar migraciones y seeders si aplica.
5. Iniciar el servidor backend:
   ```bash
   npm run dev
   ```
   El backend estará disponible en `http://localhost:4000` (o el puerto configurado).

### 3. Configuración del Frontend
1. Volver a la raíz del proyecto:
   ```bash
   cd ..
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env` y establecer la URL del backend (`NEXT_PUBLIC_API_URL`).
4. Iniciar el servidor frontend:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:3000`.

## Estructura de Carpetas
- `/src/app`: Páginas y rutas del frontend.
- `/src/components/ui`: Componentes reutilizables de interfaz.
- `/src/services`: Servicios de comunicación con la API.
- `/src/interfaces`: Tipos e interfaces TypeScript.
- `/node-backend/src/controllers`: Lógica de negocio y endpoints del backend.
- `/node-backend/src/models`: Modelos de datos y relaciones.
- `/node-backend/src/routes`: Definición de rutas de la API.

## Especificaciones Técnicas
- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, Sequelize, JWT
- **Base de datos:** PostgreSQL
- **API:** RESTful

## Autores
- Andres Salas, Fabian Acosta, Fernando Galingo

## Versión
- 1.0.0

## Licencia
Este proyecto es de uso privado. Para uso comercial o contribuciones, contactar al equipo de desarrollo.
