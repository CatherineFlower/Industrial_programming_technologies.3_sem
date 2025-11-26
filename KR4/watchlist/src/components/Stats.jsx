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
