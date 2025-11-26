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
