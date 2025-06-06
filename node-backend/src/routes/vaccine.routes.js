import { Router } from 'express';
import { getAllVaccines, createVaccine } from '../controllers/vaccine.controller.js';

const router = Router();

router.get('/vaccines', getAllVaccines);
router.post('/vaccines', createVaccine);

export default router; 