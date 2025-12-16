cat > kr4_ru.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail

# Скрипт русифицирует интерфейс KR4/watchlist и создаёт README в корне ТИП.
# Запускать из корня проекта ТИП (где есть папка KR4).

ROOT="$(pwd)"
KR4_DIR="$ROOT/KR4"
APP_DIR="$KR4_DIR/watchlist"

echo "→ Проверяем структуру…"
[[ -d "$KR4_DIR" ]] || { echo "❌ Нет папки KR4 (запусти из корня ТИП)"; exit 1; }
[[ -d "$APP_DIR" ]] || { echo "❌ Нет папки $APP_DIR (ожидается KR4/watchlist)"; exit 1; }

echo "→ Обновляем index.html…"
cat > "$APP_DIR/index.html" <<'EOF'
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Список фильмов</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

echo "→ Обновляем src/App.jsx…"
cat > "$APP_DIR/src/App.jsx" <<'EOF'
import React from 'react'
import { MoviesProvider } from './context/MoviesContext.jsx'
import MovieForm from './components/MovieForm.jsx'
import MovieList from './components/MovieList.jsx'
import Stats from './components/Stats.jsx'

export default function App(){
  return (
    <div className="container">
      <h1>Список фильмов — хочу посмотреть / посмотрено</h1>
      <MoviesProvider>
        <Stats/>
        <MovieForm/>
        <MovieList/>
      </MoviesProvider>
    </div>
  )
}
EOF

echo "→ Обновляем src/utils/sampleData.js…"
cat > "$APP_DIR/src/utils/sampleData.js" <<'EOF'
export const samples = [
  { id:'s1', title:'Интерстеллар', year:2014, genres:['sci-fi','драма'], note:'Нолан', createdAt:Date.now()-100000, status:'wishlist' },
  { id:'s2', title:'Матрица', year:1999, genres:['sci-fi','боевик'], note:'Вачовски', createdAt:Date.now()-200000, status:'watched' },
  { id:'s3', title:'Социальная сеть', year:2010, genres:['драма'], note:'Финчи', createdAt:Date.now()-300000, status:'wishlist' }
]
EOF

echo "→ Обновляем watchlist/README.md…"
cat > "$APP_DIR/README.md" <<'EOF'
Список фильмов (React)

SPA для учёта фильмов: «хочу посмотреть» / «посмотрено».
Данные сохраняются в localStorage. Есть поиск, фильтры, сортировка и редактирование.

Стек:
- React + Vite
- useReducer + Context
- localStorage

Запуск:
1) npm i
2) npm run dev
3) открой http://localhost:5173

Возможности:
- Добавление фильма (название, год, жанры, заметка)
- Переключение статуса «хочу» ⇄ «посмотрено»
- Поиск по названию, фильтр по статусу и жанру
- Сортировка: по названию / году / дате добавления
- Редактирование и удаление
- Счётчики по статусам
- Автосохранение в localStorage
- Кнопка «Загрузить примеры»

Структура:
src/
  App.jsx
  styles.css
  context/MoviesContext.jsx
  components/{MovieForm,MovieList,MovieItem,Filters,Stats}.jsx
  hooks/useLocalStorageReducer.js
  utils/sampleData.js
EOF

echo "→ Обновляем README.md в корне ТИП…"
cat > "$ROOT/README.md" <<'EOF'
Контрольная работа №4 — React-приложение «Список фильмов»

Тема: список фильмов с двумя статусами — «хочу посмотреть» и «посмотрено».
Цель: показать владение компонентами, состоянием, событиями, хранением данных и архитектурой SPA.

Кратко:
Приложение добавляет фильмы, позволяет менять статус, искать, фильтровать и сортировать.
Данные хранятся в localStorage.

Основные возможности:
- Добавление фильма (название, год, жанры, заметка)
- Переключение статуса «хочу посмотреть» ↔ «посмотрено»
- Поиск по названию, фильтр по статусу и жанру
- Сортировка: по названию, году, дате добавления
- Редактирование/удаление
- Счётчики по статусам
- Автосохранение в localStorage
- Загрузка тестовых данных

Технологии:
- React + Vite, useReducer + Context
- Хранение: useLocalStorageReducer (синхронизация с localStorage)
- Компоненты: MovieForm, MovieList, MovieItem, Filters, Stats

Структура репозитория:
KR4/
  watchlist/
    index.html
    package.json
    vite.config.js
    src/...
README.md (этот файл в корне ТИП)

Запуск проекта:
cd KR4/watchlist
npm i
npm run dev
затем открой http://localhost:5173

Скриншоты: добавьте 2–4 изображения ключевых экранов.
Ссылка на GitHub: добавьте ссылку на репозиторий с исходниками и README.
EOF

# (необязательно) русифицируем "name" в package.json
if [[ -f "$APP_DIR/package.json" ]]; then
  if command -v jq >/dev/null 2>&1; then
    tmp="$APP_DIR/package.tmp.json"
    jq '.name="spisok-filmov"' "$APP_DIR/package.json" > "$tmp" && mv "$tmp" "$APP_DIR/package.json"
  else
    if sed --version >/dev/null 2>&1; then
      sed -i 's/"name": *"[^"]*"/"name": "spisok-filmov"/' "$APP_DIR/package.json"
    else
      sed -i '' 's/"name": *"[^"]*"/"name": "spisok-filmov"/' "$APP_DIR/package.json" || true
    fi
  fi
fi

echo "✅ Готово! Обновлены файлы и README."
echo "Запуск dev: cd KR4/watchlist && npm i && npm run dev -- --open"
SH
chmod +x kr4_ru.sh
echo "Создан файл kr4_ru.sh (исполняемый). Запуск: ./kr4_ru.sh"
