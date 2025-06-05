import { Router } from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale
} from '../controllers/sale.controller.js';

const router = Router();

// Rutas para ventas
router.get('/sales', getAllSales);
router.get('/sales/:id', getSaleById);
router.post('/sales', createSale);
router.put('/sales/:id', updateSale);
router.delete('/sales/:id', deleteSale);

export default router; 