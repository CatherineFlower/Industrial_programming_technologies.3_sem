
# Контрольная работа №3 — Вариант 3 (4 задания, JS)

Набор из четырёх самостоятельных задач на современный JavaScript (ES2022+).  
Каждый файл можно запускать напрямую через `node` — в конце есть небольшой демо-блок.

## Состав
- `task1_square.js` — класс `Square` с приватным свойством `_side`, валидацией, геттерами `area` и `perimeter`.
- `task2_loadData.js` — функция `loadData(callback)` имитирует загрузку через `setTimeout(3000)` и передаёт в колбэк строку «Данные успешно получены!». Включена обёртка `loadDataAsync()` на промисах.
- `task3_checkAge.js` — функция `checkAge(age)` возвращает `Promise`. Если `age >= 18` → `resolve("Доступ разрешён")`, иначе → `reject("Доступ запрещён")`.
- `task4_readFilePromise.js` — имитация `readFile(path, callback)` с `setTimeout`. Функция `readFilePromise(path)` возвращает промис: `reject` при ошибке и `resolve` с содержимым «файла».

## Запуск
```bash
node task1_square.js
node task2_loadData.js
node task3_checkAge.js
node task4_readFilePromise.js
```

## Примечания
- Код написан без внешних зависимостей: достаточно Node.js.
- Все проверки и сообщения на русском, чтобы удобнее было демонстрировать работу.
