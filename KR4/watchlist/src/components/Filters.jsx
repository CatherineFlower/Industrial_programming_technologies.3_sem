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
