import { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Hero from './sections/Hero'
import Login from './components/Login'
import './App.css'
import RegistrationPage from './components/RegistrationPage'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Hero/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<RegistrationPage/>}/>
        
      </Routes>
    </>
  )
}

export default App
