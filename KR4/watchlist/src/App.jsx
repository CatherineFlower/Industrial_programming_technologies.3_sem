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
