import { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Hero from './sections/Hero'
import Login from './components/Login'
import './App.css'
import RegistrationPage from './components/RegistrationPage'
import News from './components/News'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Crop_Details from './components/Crop_Details'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Hero/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<RegistrationPage/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/crop-details' element={<Crop_Details/>}/>
        
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
