import { Router } from 'express';
import { getAllOutputs, createOutput } from '../controllers/output.controller.js';

const router = Router();

router.get('/outputs', getAllOutputs);
router.post('/outputs', createOutput);

export default router; 