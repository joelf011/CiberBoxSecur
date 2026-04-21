import { useState } from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />
      <Footer />
    </>
  )
}

export default App
