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
