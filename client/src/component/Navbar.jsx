import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [openOptionMobile, setOpenOptionMobile] = useState(false);
  const isLogin = localStorage.getItem('loggedin');
  useEffect(() => {
    console.log(isLogin);
  }, [isLogin]);
  return (
    <>


      <div className='z-40 flex w-full h-[8vh] fixed top-0  mb-[5rem] shadow-lg bg-black text-white justify-end'>
        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-4 mr-[2%] mt-3'>
          {console.log(isLogin)}
          {isLogin ? (
            <>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/profile'>Profile</NavLink>
            <NavLink to='/createPost'>CreatePost</NavLink>
            <div  className='cursor-pointer' onClick={() => { localStorage.clear(); navigate('/signin'); }}>Logout</div>
            </>
          ) : (
            <>
            <NavLink to='/signin'>LogIn</NavLink>
            <NavLink to='/signup'>SignUp</NavLink>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden mt-4 mr-[2%]'>
          {openOptionMobile ? (
            <div>
              <span onClick={() => setOpenOptionMobile(false)} className="material-symbols-outlined">
                Close
              </span>
              <div className='flex  m-auto flex-col text-black bg-white mt-[5%]  w-[30vw]  p-[8%] text-xl pl-[30%]'>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/profile'>Profile</NavLink>
                <NavLink to='/createPost'>CreatePost</NavLink>
                <NavLink to='/signin'>LogIn</NavLink>
                <NavLink to='/signup'>SignUp</NavLink>
              </div>
            </div>
          ) : (
            <span onClick={() => setOpenOptionMobile(true)} className="material-symbols-outlined">
              Menu
            </span>
          )}
        </div>
      </div>





    </>
  )
}
