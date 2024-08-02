import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DynamicForm from './components/DynamicForm';
import logo from './logo.jpg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header className="header-container">
        {/* Agrega la imagen */}
        <img src={logo} alt="Descripción de la imagen" />
        <h1 className='creative-title'>INFORMACION PARA RAC</h1>
        
      </header>
      <div>
        <DynamicForm />
      </div>
    </>
  )
}

export default App