import { Router } from 'express';
import { login, register, requestPasswordReset, verifyResetToken, resetPassword, updateEmail, updateProfile, getUserProfile } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Rutas para la recuperación de contraseña
router.post('/reset-password/request', requestPasswordReset);
router.get('/reset-password/verify/:token', verifyResetToken);
router.post('/reset-password/reset', resetPassword);

// Ruta para actualizar correo electrónico
router.post('/update-email', updateEmail);

// Rutas para el perfil de usuario
router.post('/update-profile', updateProfile);
router.get('/profile/:userId', getUserProfile);

export default router; 