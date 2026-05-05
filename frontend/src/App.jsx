import { useState } from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import LayoutWebsite from './components/LayoutWebsite'
import Home from './pages/Home';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LayoutWebsite>

        <Home />
        
      </LayoutWebsite>
    </>
  )
}

export default App
