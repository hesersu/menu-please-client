import './App.css'
import { Route, Routes } from "react-router-dom"
import { SignUpPage } from './pages/SignUpPage'
import { LoginPage } from'./pages/LoginPage'

function App() {

  return (
    <>
    <h1 className='text-7xl text-center'>Hello World</h1>
    <Routes>
    <Route path ="/Sign-up" element={<SignUpPage />} />
    <Route path ="/Login" element={<LoginPage />} />
    </Routes>
    </>
  )
}

export default App  
