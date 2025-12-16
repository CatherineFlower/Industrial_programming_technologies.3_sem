set -e

# создать структуру
mkdir -p watchlist/src/{context,components,hooks,utils}

# package.json
cat > watchlist/package.json <<'EOF'
{
  "name": "watchlist",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}
EOF

# vite.config.js
cat > watchlist/vite.config.js <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
EOF

# index.html
cat > watchlist/index.html <<'EOF'
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Watchlist</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

# styles.css
cat > watchlist/src/styles.css <<'EOF'
:root{ --bg:#0b1220; --card:#0f172a; --text:#e5e7eb; --muted:#94a3b8; --bd:#1f2a44; --acc:#60a5fa; --ok:#10b981; --warn:#f59e0b; }
*{box-sizing:border-box}
body{ margin:24px; font:15px/1.6 system-ui, -apple-system, Segoe UI, Inter, sans-serif; color:var(--text);
      background:radial-gradient(1000px 700px at 10% -10%, rgba(96,165,250,.12), transparent 50%), var(--bg); }
h1,h2{margin:0 0 12px}
.container{ max-width:1000px; margin:0 auto }
.card{ background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.015));
       border:1px solid var(--bd); border-radius:14px; padding:16px; margin:12px 0; box-shadow:0 18px 30px rgba(0,0,0,.35); }
.row{display:flex; gap:10px; flex-wrap:wrap }
input,select,button,textarea{ background:#0e1730; color:var(--text); border:1px solid var(--bd); border-radius:10px; padding:8px 10px }
button{ cursor:pointer }
button.primary{ background:#0e1730; border-color:var(--acc) }
button.danger{ border-color:#ef4444; color:#fecaca }
.badge{ padding:2px 8px; border:1px solid var(--bd); border-radius:999px; font-size:12px; }
.badge.ok{ border-color:var(--ok); color:#a7f3d0 }
.badge.warn{ border-color:var(--warn); color:#fde68a }
.list{ display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px }
.item{ border:1px solid var(--bd); border-radius:12px; padding:12px; background:#0b1426 }
.item h4{ margin:0 0 6px; font-weight:600 }
.item-footer{ display:flex; justify-content:space-between; align-items:center; gap:6px; margin-top:8px }
small.muted{ color:var(--muted) }
@media (max-width:480px){ .row> * { flex:1 1 100% } }
EOF

# main.jsx
cat > watchlist/src/main.jsx <<'EOF'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(<App/>)
EOF

# App.jsx
cat > watchlist/src/App.jsx <<'EOF'
import React from 'react'
import { MoviesProvider } from './context/MoviesContext.jsx'
import MovieForm from './components/MovieForm.jsx'
import MovieList from './components/MovieList.jsx'
import Stats from './components/Stats.jsx'

export default function App(){
  return (
    <div className="container">
      <h1>Watchlist — список фильмов</h1>
      <MoviesProvider>
        <Stats/>
        <MovieForm/>
        <MovieList/>
      </MoviesProvider>
    </div>
  )
}
EOF

# MoviesContext.jsx
cat > watchlist/src/context/MoviesContext.jsx <<'EOF'
import React, { createContext, useContext, useReducer } from 'react'
import { useLocalStorageReducer } from '../hooks/useLocalStorageReducer.js'

const MoviesContext = createContext()

export const STATUSES = {
  WISHLIST: 'wishlist',
  WATCHED: 'watched'
}

function moviesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [{ ...action.payload, id: crypto.randomUUID(), createdAt: Date.now(), status: STATUSES.WISHLIST }, ...state]
    case 'TOGGLE_STATUS':
      return state.map(m => m.id === action.id ? { ...m, status: m.status === STATUSES.WISHLIST ? STATUSES.WATCHED : STATUSES.WISHLIST } : m)
    case 'UPDATE':
      return state.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m)
    case 'REMOVE':
      return state.filter(m => m.id !== action.id)
    case 'BULK_LOAD':
      return action.items
    default:
      return state
  }
}

export function MoviesProvider({ children }) {
  const [state, dispatch] = useLocalStorageReducer('watchlist:v1', moviesReducer, [])
  const value = { movies: state, dispatch }
  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>
}

export function useMovies(){
  const ctx = useContext(MoviesContext)
  if (!ctx) throw new Error('useMovies must be used within MoviesProvider')
  return ctx
}
EOF

# useLocalStorageReducer.js
cat > watchlist/src/hooks/useLocalStorageReducer.js <<'EOF'
import { useEffect, useReducer } from 'react'

export function useLocalStorageReducer(key, reducer, initialState){
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try{
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : init
    }catch{ return init }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)) }, [key, state])
  return [state, dispatch]
}
EOF

# sampleData.js
cat > watchlist/src/utils/sampleData.js <<'EOF'
export const samples = [
  { id:'s1', title:'Interstellar', year:2014, genres:['sci-fi','drama'], note:'Nolan', createdAt:Date.now()-100000, status:'wishlist' },
  { id:'s2', title:'The Matrix', year:1999, genres:['sci-fi','action'], note:'Wachowskis', createdAt:Date.now()-200000, status:'watched' },
  { id:'s3', title:'The Social Network', year:2010, genres:['drama'], note:'Fincher', createdAt:Date.now()-300000, status:'wishlist' }
]
EOF

# Stats.jsx
cat > watchlist/src/components/Stats.jsx <<'EOF'
import React from 'react'
import { useMovies } from '../context/MoviesContext.jsx'
export default function Stats(){
  const { movies } = useMovies()
  const total = movies.length
  const watched = movies.filter(m => m.status === 'watched').length
  const wishlist = total - watched
  return (
    <div className="row" aria-label="stats">
      <span className="badge ok">Посмотрено: {watched}</span>
      <span className="badge warn">Хочу: {wishlist}</span>
      <small className="muted">Всего: {total}</small>
    </div>
  )
}
EOF

# MovieForm.jsx
cat > watchlist/src/components/MovieForm.jsx <<'EOF'
import React, { useState } from 'react'
import { useMovies } from '../context/MoviesContext.jsx'

export default function MovieForm(){
  const { dispatch } = useMovies()
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [genres, setGenres] = useState('')
  const [note, setNote] = useState('')

  function submit(e){
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      year: year ? Number(year) : null,
      genres: genres ? genres.split(',').map(g => g.trim().toLowerCase()).filter(Boolean) : [],
      note: note.trim()
    }
    dispatch({ type:'ADD', payload })
    setTitle(''); setYear(''); setGenres(''); setNote('')
  }

  return (
    <form onSubmit={submit} className="card" aria-label="add-movie-form">
      <h3>Добавить фильм</h3>
      <div className="row">
        <input placeholder="Название *" value={title} onChange={e=>setTitle(e.target.value)} required/>
        <input placeholder="Год" type="number" min="1888" value={year} onChange={e=>setYear(e.target.value)}/>
        <input placeholder="Жанры (через запятую)" value={genres} onChange={e=>setGenres(e.target.value)}/>
      </div>
      <div className="row">
        <textarea placeholder="Заметка" rows={2} value={note} onChange={e=>setNote(e.target.value)} style={{flex:1}}/>
        <button className="primary" type="submit">Добавить</button>
      </div>
    </form>
  )
}
EOF

# Filters.jsx
cat > watchlist/src/components/Filters.jsx <<'EOF'
import React, { useMemo, useState } from 'react'
import { useMovies, STATUSES } from '../context/MoviesContext.jsx'

export default function Filters({ onChange }){
  const { movies } = useMovies()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [genre, setGenre] = useState('all')
  const [sort, setSort] = useState('createdAt-desc')

  const genres = useMemo(() => {
    const s = new Set()
    movies.forEach(m => (m.genres||[]).forEach(g => s.add(g)))
    return ['all', ...Array.from(s).sort()]
  }, [movies])

  function emit(){
    onChange && onChange({ q, status, genre, sort })
  }
  return (
    <div className="card">
      <div className="row">
        <input placeholder="Поиск по названию" value={q} onChange={e=>{setQ(e.target.value); emit()}}/>
        <select value={status} onChange={e=>{setStatus(e.target.value); emit()}}>
          <option value="all">Все</option>
          <option value={STATUSES.WISHLIST}>Хочу посмотреть</option>
          <option value={STATUSES.WATCHED}>Посмотрено</option>
        </select>
        <select value={genre} onChange={e=>{setGenre(e.target.value); emit()}}>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={sort} onChange={e=>{setSort(e.target.value); emit()}}>
          <option value="createdAt-desc">Сначала новые</option>
          <option value="createdAt-asc">Сначала старые</option>
          <option value="title-asc">Название A→Z</option>
          <option value="title-desc">Название Z→A</option>
          <option value="year-desc">Год по убыв.</option>
          <option value="year-asc">Год по возр.</option>
        </select>
        <button onClick={emit}>Применить</button>
      </div>
    </div>
  )
}
EOF

# MovieItem.jsx
cat > watchlist/src/components/MovieItem.jsx <<'EOF'
import React, { useState } from 'react'
import { useMovies, STATUSES } from '../context/MoviesContext.jsx'

export default function MovieItem({ movie }){
  const { dispatch } = useMovies()
  const [isEdit, setIsEdit] = useState(false)
  const [draft, setDraft] = useState({ title: movie.title, year: movie.year ?? '', genres:(movie.genres||[]).join(', '), note: movie.note||'' })

  function save(){
    dispatch({ type:'UPDATE', payload:{
      id: movie.id,
      title: draft.title.trim() || movie.title,
      year: draft.year ? Number(draft.year) : null,
      genres: draft.genres ? draft.genres.split(',').map(g=>g.trim().toLowerCase()).filter(Boolean) : [],
      note: draft.note.trim()
    }})
    setIsEdit(false)
  }

  return (
    <div className="item" role="article">
      {isEdit ? (
        <>
          <input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
          <div className="row">
            <input type="number" value={draft.year} onChange={e=>setDraft({...draft,year:e.target.value})}/>
            <input value={draft.genres} onChange={e=>setDraft({...draft,genres:e.target.value})}/>
          </div>
          <textarea rows={2} value={draft.note} onChange={e=>setDraft({...draft,note:e.target.value})}/>
          <div className="item-footer">
            <button onClick={save} className="primary">Сохранить</button>
            <button onClick={()=>setIsEdit(false)}>Отмена</button>
          </div>
        </>
      ) : (
        <>
          <h4 title={movie.note || ''}>{movie.title} {movie.year ? `(${movie.year})` : ''}</h4>
          <small className="muted">{movie.genres?.join(', ')}</small>
          <div className="item-footer">
            <span className={'badge ' + (movie.status===STATUSES.WATCHED ? 'ok':'warn')}>
              {movie.status===STATUSES.WATCHED ? 'посмотрено' : 'хочу посмотреть'}
            </span>
            <div className="row">
              <button onClick={()=>dispatch({type:'TOGGLE_STATUS', id:movie.id})}>
                {movie.status===STATUSES.WATCHED ? 'В «хочу»' : 'В «посмотрено»'}
              </button>
              <button onClick={()=>setIsEdit(true)}>Редакт.</button>
              <button className="danger" onClick={()=>dispatch({type:'REMOVE', id:movie.id})}>Удалить</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
EOF

# MovieList.jsx
cat > watchlist/src/components/MovieList.jsx <<'EOF'
import React, { useMemo, useState } from 'react'
import { useMovies } from '../context/MoviesContext.jsx'
import MovieItem from './MovieItem.jsx'
import Filters from './Filters.jsx'
import { samples } from '../utils/sampleData.js'

export default function MovieList(){
  const { movies, dispatch } = useMovies()
  const [flt, setFlt] = useState({ q:'', status:'all', genre:'all', sort:'createdAt-desc' })

  const filtered = useMemo(() => {
    let arr = movies.slice()
    if (flt.q) arr = arr.filter(m => m.title.toLowerCase().includes(flt.q.toLowerCase()))
    if (flt.status !== 'all') arr = arr.filter(m => m.status === flt.status)
    if (flt.genre !== 'all') arr = arr.filter(m => (m.genres||[]).includes(flt.genre))
    const [key, dir] = flt.sort.split('-')
    arr.sort((a,b) => {
      const va = (a[key] ?? '')
      const vb = (b[key] ?? '')
      if (typeof va === 'string') return dir==='asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return dir==='asc' ? (va - vb) : (vb - va)
    })
    return arr
  }, [movies, flt])

  return (
    <>
      <Filters onChange={setFlt}/>
      <div className="row">
        <button onClick={()=>dispatch({type:'BULK_LOAD', items:samples})}>Загрузить примеры</button>
        <button className="danger" onClick={()=>dispatch({type:'BULK_LOAD', items:[]})}>Очистить всё</button>
      </div>
      <div className="list">
        {filtered.map(m => <MovieItem key={m.id} movie={m}/>)}
        {filtered.length===0 && <div className="card">Ничего не найдено</div>}
      </div>
    </>
  )
}
EOF
