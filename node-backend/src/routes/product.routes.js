import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateProductStock,
  getLowStockProducts
} from '../controllers/product.controller.js';

const router = Router();

// Rutas para productos
router.get('/products', getAllProducts);
router.get('/products/low-stock', getLowStockProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.put('/products/:id/stock', updateProductStock);
router.delete('/products/:id', deleteProduct);

export default router; 