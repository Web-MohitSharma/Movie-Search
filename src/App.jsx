import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import MovieRecommendations from './components/MovieApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MovieRecommendations/>
  )
}

export default App
