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
