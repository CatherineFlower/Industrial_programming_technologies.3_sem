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
