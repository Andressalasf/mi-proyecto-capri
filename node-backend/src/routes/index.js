import { Router } from 'express';
import supplierRoutes from './supplier.routes.js';
import goatRoutes from './goat.routes.js';

const router = Router();

router.use(supplierRoutes);
router.use(goatRoutes);

export default router; 