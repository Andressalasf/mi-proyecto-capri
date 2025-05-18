import { Router } from 'express';
import { 
  getAllStaff, 
  getStaffById, 
  createStaff, 
  updateStaff, 
  deleteStaff 
} from '../controllers/staff.controller.js';

const router = Router();

// Rutas para empleados
router.get('/staff', getAllStaff);
router.get('/staff/:id', getStaffById);
router.post('/staff', createStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

export default router; 