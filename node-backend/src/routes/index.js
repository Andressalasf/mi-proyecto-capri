import { Router } from 'express';
import supplierRoutes from './supplier.routes.js';
import goatRoutes from './goat.routes.js';
import saleRoutes from './sale.routes.js';

const router = Router();

router.use(supplierRoutes);
router.use(goatRoutes);
router.use(saleRoutes);

export default router; 