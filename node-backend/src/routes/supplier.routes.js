import { Router } from 'express';
import { 
  getAllSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier 
} from '../controllers/supplier.controller.js';

const router = Router();

// Rutas para proveedores
router.get('/suppliers', getAllSuppliers);
router.get('/suppliers/:id', getSupplierById);
router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

export default router; 