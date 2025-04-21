import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Person } from '../models/person.model.js';
import { Sequelize } from 'sequelize';

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';

export const register = async (req, res) => {
  try {
    console.log('Recibiendo solicitud de registro:', req.body);
    
    // Validar datos requeridos
    const { code, first_name, last_name, surname, phone, email, password } = req.body;
    
    if (!code || !first_name || !last_name || !surname || !email || !password) {
      console.log('Datos incompletos en la solicitud de registro');
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios excepto teléfono',
        missingFields: Object.entries({
          code, first_name, last_name, surname, email, password
        }).filter(([_, value]) => !value).map(([key]) => key)
      });
    }

    // Verificar si el correo ya existe
    const existingUser = await Person.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email ya registrado:', email);
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada correctamente');

    // Crear usuario
    console.log('Intentando crear usuario con datos:', { 
      code, first_name, last_name, surname, phone, email, password: '********' 
    });
    
    try {
      const newUser = await Person.create({
        code,
        first_name,
        last_name,
        surname,
        phone,
        email,
        password: hashedPassword
      });
      
      console.log('Usuario creado correctamente con ID:', newUser.id);
  
      // Eliminar la contraseña para la respuesta
      const user = newUser.toJSON();
      delete user.password;
  
      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user
      });
    } catch (dbError) {
      console.error('Error específico al crear usuario en la base de datos:', dbError);
      
      // Manejar errores específicos de Sequelize
      if (dbError instanceof Sequelize.UniqueConstraintError) {
        return res.status(400).json({ 
          message: 'Ya existe un usuario con ese código o correo electrónico',
          fields: dbError.fields
        });
      }
      
      throw dbError; // Re-lanzar para el manejo general
    }
  } catch (error) {
    console.error('Error en registro:', error);
    console.error('Detalles completos del error:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      message: 'Error al registrar usuario', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    // Buscar usuario por email y código
    const user = await Person.findOne({
      where: {
        email,
        code
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
}; 