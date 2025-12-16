import { Router } from 'express';
import { calcBmi, getBmiByParams, getBmiInfo } from '../controllers/bmi.controller.js';
const router = Router();
router.get('/calc', getBmiByParams);
router.post('/calc', calcBmi);
router.get('/info', getBmiInfo);
export default router;