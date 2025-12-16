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
      <section className="panel panel-glass add-panel">
          <h2>Добавить фильм</h2>
    <form onSubmit={submit} className="movie-form" aria-label="add-movie-form">
      <div className="row">
        <input placeholder="Название *" value={title} onChange={e=>setTitle(e.target.value)} required/>
        <input placeholder="Год" type="number" min="1888" value={year} onChange={e=>setYear(e.target.value)}/>
        <input placeholder="Жанры (через запятую)" value={genres} onChange={e=>setGenres(e.target.value)}/>
      </div>
        <textarea placeholder="Заметка" rows={2} value={note} onChange={e=>setNote(e.target.value)} style={{flex:1}}/>
      <div className="actions">
        <button className="primary" type="submit">Добавить</button>
      </div>
    </form>
      </section>
  )
}
