import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Person } from '../models/person.model.js';
import { Sequelize } from 'sequelize';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';

// Modelo para almacenar tokens de restablecimiento (para implementar en una base de datos real)
const resetTokens = new Map();

// Configuración del transporte de correo electrónico
const transporter = nodemailer.createTransport({
  /* Opción 1: Usar Gmail
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu_contraseña',
  },
  */
  
  // Opción 2: Usar Ethereal para pruebas (no envía correos reales, pero muestra la vista previa)
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'tu_correo@ethereal.email',
    pass: process.env.EMAIL_PASSWORD || 'tu_contraseña',
  },
});

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

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'El correo electrónico y el código son obligatorios' });
    }

    // Buscar al usuario por email y código
    const user = await Person.findOne({
      where: {
        email,
        code
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'No se encontró ninguna cuenta con este correo y código' });
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token válido por 1 hora

    // Almacenar token (en una aplicación real esto iría a la base de datos)
    resetTokens.set(resetToken, {
      userId: user.id,
      expiry: tokenExpiry
    });

    // URL para restablecer contraseña (ajustar según tu configuración)
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Configurar correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER || 'tu_correo@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña - Granme',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6b7c45;">Recuperación de contraseña - Granme</h2>
          <p>Hola ${user.first_name},</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <p>
            <a 
              href="${resetUrl}" 
              style="display: inline-block; background-color: #6b7c45; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
            >
              Restablecer contraseña
            </a>
          </p>
          <p>Este enlace es válido por 1 hora.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
          <p>Saludos,<br>El equipo de Granme</p>
        </div>
      `
    };

    // Enviar correo electrónico
    console.log('Enviando correo electrónico a:', email);
    
    // Enviar correo real (descomentar y configurar credenciales en .env o directamente aquí)
    try {
      // Intentar enviar el correo
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado exitosamente');
      
      // Para Ethereal Email (servicio de prueba), mostrar la URL de previsualización
      if (info.ethereal) {
        console.log('Vista previa del correo disponible en:', info.previewUrl);
      }
      
      // Para pruebas: loguear el enlace en la consola
      console.log('Enlace de restablecimiento (usar este enlace manualmente):', resetUrl);
    } catch (emailError) {
      console.error('Error al enviar correo:', emailError);
      console.log('Enlace de restablecimiento (usar este enlace manualmente):', resetUrl);
    }

    return res.status(200).json({ 
      message: 'Se ha enviado un enlace de recuperación a su correo electrónico',
      // En modo desarrollo, enviar el token y el enlace para pruebas directas
      developmentMode: true,
      resetToken: resetToken,
      resetUrl: resetUrl
    });

  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    return res.status(500).json({ 
      message: 'Error al procesar la solicitud de recuperación de contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar token de restablecimiento
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verificar si el token existe
    if (!resetTokens.has(token)) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
    
    // Verificar si el token ha expirado
    const tokenData = resetTokens.get(token);
    if (new Date() > new Date(tokenData.expiry)) {
      resetTokens.delete(token); // Eliminar token expirado
      return res.status(400).json({ message: 'El enlace ha expirado' });
    }
    
    return res.status(200).json({ message: 'Token válido' });
    
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(500).json({ 
      message: 'Error al verificar el token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Validaciones
    if (!token || !password) {
      return res.status(400).json({ message: 'Token y contraseña son obligatorios' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Verificar si el token existe
    if (!resetTokens.has(token)) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
    
    // Verificar si el token ha expirado
    const tokenData = resetTokens.get(token);
    if (new Date() > new Date(tokenData.expiry)) {
      resetTokens.delete(token); // Eliminar token expirado
      return res.status(400).json({ message: 'El enlace ha expirado' });
    }
    
    // Buscar al usuario
    const userId = tokenData.userId;
    const user = await Person.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    
    // Eliminar token utilizado
    resetTokens.delete(token);
    
    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return res.status(500).json({ 
      message: 'Error al restablecer contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cambiar correo electrónico
export const updateEmail = async (req, res) => {
  try {
    const { userId, currentEmail, newEmail, password } = req.body;

    // Validar datos requeridos
    if (!userId || !currentEmail || !newEmail || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Verificar si el nuevo correo ya existe
    const existingEmail = await Person.findOne({ where: { email: newEmail } });
    if (existingEmail) {
      return res.status(400).json({ 
        message: 'El correo electrónico ya está registrado por otro usuario' 
      });
    }

    // Buscar al usuario
    const user = await Person.findOne({ 
      where: { 
        id: userId,
        email: currentEmail
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

    // Actualizar el correo electrónico
    user.email = newEmail;
    await user.save();

    // Generar nuevo token con el correo actualizado
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
      message: 'Correo electrónico actualizado correctamente',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      },
      token
    });
  } catch (error) {
    console.error('Error al actualizar correo electrónico:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar correo electrónico', 
      error: error.message 
    });
  }
};

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  try {
    const { userId, firstName, lastName, phone, avatar } = req.body;

    // Validar datos requeridos
    if (!userId || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'El ID de usuario, nombre y apellido son obligatorios' 
      });
    }

    // Buscar al usuario
    const user = await Person.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar datos
    user.first_name = firstName;
    user.last_name = lastName;
    
    // Actualizar teléfono y avatar solo si se proporcionan
    if (phone !== undefined) {
      user.phone = phone;
    }
    
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    
    await user.save();

    // Generar nuevo token con el nombre actualizado
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
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar perfil', 
      error: error.message 
    });
  }
};

// Obtener perfil de usuario
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar al usuario
    const user = await Person.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        code: user.code,
        firstName: user.first_name,
        lastName: user.last_name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ 
      message: 'Error al obtener perfil', 
      error: error.message 
    });
  }
}; 