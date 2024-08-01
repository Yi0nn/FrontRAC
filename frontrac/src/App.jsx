import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DynamicForm from './components/DynamicForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header><h1>INFORMACION PARA RAC</h1></header>
        <div>
          <DynamicForm />
        </div>
    </>
  )
}
export default App
