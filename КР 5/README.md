# КР 5 — Express.js: Калькулятор ИМТ (BMI)

Полноценное учебное Express‑приложение для расчёта индекса массы тела.

## Запуск
```bash
cd "КР 5"
npm i
echo "PORT=3000" > .env
npm run dev
# затем открыть http://localhost:3000
```

## API
- GET /api/bmi/info
- GET /api/bmi/calc?weight=70&height=170
- POST /api/bmi/calc  { "weight": 70, "height": 170 }

## Структура
```
KR5_BMI/
├─ package.json
├─ README.md
├─ .env.example           # пример env (PORT=3000)
├─ public/
│  └─ index.html          # статическая страница (форма ИМТ)
└─ src/
├─ server.js           # точка входа (поднимает сервер)
├─ app.js              # конфигурация приложения (express(), middleware, маршруты)
├─ routes/
│  └─ bmi.routes.js    # роуты /api/bmi/...
├─ controllers/
│  └─ bmi.controller.js # логика обработчиков
├─ middlewares/
│  ├─ logger.js        # кастомный логгер запросов
│  └─ validate.js      # пример валидации query/body
└─ utils/
└─ bmi.js           # чистые функции расчёта ИМТ
```
