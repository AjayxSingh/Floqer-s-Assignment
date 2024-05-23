import { useState } from 'react'
import './App.css'
import SalaryTable from './components/Tables'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SalaryTable/>
    </>
  )
}

export default App
