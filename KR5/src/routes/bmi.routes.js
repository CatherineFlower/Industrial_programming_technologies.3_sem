import { Router } from 'express';
import {
    calcBmi,
    getBmiByParams,
    getBmiInfo,
    calcFromParams
} from '../controllers/bmi.controller.js';

const router = Router();

router.get('/calc', getBmiByParams);             // ?weight=&height=
router.post('/calc', calcBmi);                   // { weight, height }
router.get('/info', getBmiInfo);                 // справка
router.get('/demo/:weight/:height', calcFromParams); // params

export default router;