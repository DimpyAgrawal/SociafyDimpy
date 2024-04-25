import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './component/SignIn'
import SignUp from './component/SignUp'
import Home from './component/Home'
import Navbar from './component/Navbar';
import Profile from './component/Profile';
import CreatePost from './component/CreatePost'

import { ToastContainer } from 'react-toastify'
export default function App() {
  const data  = localStorage.getItem('token') || null;
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element={data?<Home />:<SignIn/>} />

          <Route exact path='/signin' element={<SignIn />} />
          <Route exact path='/signup' element={<SignUp />} />
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/createPost' element={<CreatePost />} />
      
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}
