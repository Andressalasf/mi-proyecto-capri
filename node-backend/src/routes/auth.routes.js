import { Router } from 'express';
import { login, register, requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Rutas para la recuperación de contraseña
router.post('/reset-password/request', requestPasswordReset);
router.get('/reset-password/verify/:token', verifyResetToken);
router.post('/reset-password/reset', resetPassword);

export default router; 