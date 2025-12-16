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
