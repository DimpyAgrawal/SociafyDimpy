import React, { useState } from 'react'
import ProfilePic from './ProfilePic'

export default function OnClickProfilePicture({ setChangePic, changePic, changeProfile, userData }) {
    const [open, setOpen] = useState(false);
    const id = localStorage.getItem('id');


    return (
        <div className='flex w-[100vw] h-[100vh]'>
            <div onClick={() => setChangePic(!changePic)} className=' w-[100vw] h-[100vh] bg-gray-700 bg-opacity-70 fixed top-0 left-0 inset-0' ></div>
            <div className='z-40'>

                {open ? <ProfilePic changeProfile={changeProfile} />
                    :
                    <div className='flex m-auto ml-3 w-[60%] rounded-md p-4  bg-white'>
                        <div class="flex items-center justify-center w-full">
                            <img
                                onClick={changeProfile}
                                className=' object-scale-down  rounded-md w-[40rem] h-[20rem]'
                                src={userData && userData.photo
                                    ? userData.photo
                                    : "http://res.cloudinary.com/dtjc6fasp/image/upload/v1705425825/g1tooriwfpklg8dcrkjq.jpg"}
                                alt=""
                            />
                        </div>
                        {id == userData._id &&<>
                            <div><button className='text-blue-600 mt-[130%] mr-10' onClick={() => setOpen(!open)}>change Profile Picture</button>
                            </div>

                        </>}{
                        }

                    </div>}
            </div>
        </div>
    )
}

