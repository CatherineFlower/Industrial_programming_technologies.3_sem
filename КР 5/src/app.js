import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bmiRouter from './routes/bmi.routes.js';
import { requestTimer } from './middlewares/requestTimer.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(requestTimer);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/bmi', bmiRouter);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});
app.use((err, req, res, next) => {
  console.error('❌ Ошибка:', err);
  res.status(err.status || 500).json({ error: err.message || 'Внутренняя ошибка сервера' });
});
export default app;