import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import ProfilePic from './ProfilePic';
import OnClickProfilePicture from './OnClickProfilePicture';
import { useLocation } from 'react-router-dom';

export default function Profile() {

  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');
  const User_ID = localStorage.getItem('id');
  const [allPost, setPost] = useState([]);
  const [flength, setFLength] = useState(0);

  const [followed, setFollowed] = useState(false);
  const ID_OF_FRIEND = location.state && location.state.ID;
  const [f, setF] = useState(false);

  // console.log(token);
  // console.log(User_ID);

  const fetchProfileData = async (id) => {
    try {
      // console.log(token);
      const response = await axios.get(`http://localhost:8080/getProfileData/${id}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      const user = response.data.user;
      console.log(user);
      setUserData(user);
      setFollowed(user.followers.includes(User_ID))
      console.log(user.followers.includes(User_ID));
      setFLength(user.following.length); // Update flength based on the API response

      console.log(user._id);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchProfilePost = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/post/posts/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      const user = response.data;
      // console.log(response);
      setPost(user);

    } catch (error) {
      console.log('error in fetching user data', error);
    }
  }

  const [changePic, setChangePic] = useState(false);

  const changeProfile = () => {
    if (changePic) setChangePic(false);
    else setChangePic(true);
  }

  const submitFollowers = async (e) => {
    e.preventDefault()
    console.log('inside submit followers');
    console.log(userData._id);

    try {
      const res = await axios.put('http://localhost:8080/saveFollowers', { userId: userData._id }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      setF(!f)
      console.log(res.data);

    } catch (error) {
      console.log('Error submitting followers', error);
    }
  }

  const submitUnFollowers = async (e) => {
    e.preventDefault();
    console.log('inside submitUnlike function');
    try {
      const res = await axios.put('http://localhost:8080/saveunFollowers', { userId: userData._id }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      setF(!f)
      console.log(res.data);
    } catch (error) {
      console.log('error in submitUnFollowers', error);
    }
  }

  const See_ID = ID_OF_FRIEND || User_ID;
  useEffect(() => {
    fetchProfileData(See_ID);
    fetchProfilePost(See_ID);
  }, [See_ID, f]);



  return (
    <>
      <div className='w-full h-full absolute mt-[5%]'>
        {/* upper div for image and followers & following */}
        <div className='flex w-[40%]  m-auto '>
          <div className='w-[20%]'>
            <img
              onClick={changeProfile}
              className='hidden mt-3 sm:flex  sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] cursor-pointer rounded-full'
              src={userData && userData.photo
                ? userData.photo
                : "http://res.cloudinary.com/dtjc6fasp/image/upload/v1705425825/g1tooriwfpklg8dcrkjq.jpg"}
              alt=""
            />

            {/* {changePic && <ProfilePic changeProfile={changeProfile} />} */}
            {changePic && <OnClickProfilePicture  changePic={changePic} setChangePic={setChangePic} changeProfile={changeProfile} userData={userData} />}
          </div>

          <div className='ml-[8%] m-auto  mt-8'>
            <div className='font-bold text-xl '><p>{userData ? userData.name : 'DIMPY'}</p></div>
            <div className='flex gap-x-3 mt-2'>

              <div> <p> {flength} following</p></div>
              <div> <p>{userData ? userData.followers.length : '0'} followers</p> </div>



              {/* <div className='border-2 border-black cursor-pointer bg-red-500 text-white justify-center p-1 rounded-xl'> */}

                {followed ? (
                  <p className='text-red-600 cursor-pointer' onClick={(e) => submitUnFollowers(e)}>Un-Follow</p>
                ) : (
                  <p className='text-blue-700 cursor-pointer' onClick={(e) => submitFollowers(e)}>Follow</p>
                )}
              {/* </div> */}
              <div>

              </div>
            </div>
          </div>
        </div>
        <hr className='w-[40%] h-[2px] m-auto bg-slate-400 mt-3' />

        {/* lower div for posts */}
        {allPost && allPost.length > 0 ? (
          <div className='flex flex-wrap  w-[45%] p-4 m-auto mt-[2%] ml-[28%] '>
            {allPost.map((post) => (
              <div className='flex flex-wrap gap-y-2' key={post._id}>
                <img className='mx-2 rounded-2xl w-[12rem] h-[15rem]  ' src={post.photo || "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1700438400&semt=sph"} alt='' />
              </div>
            ))}
          </div>
        ) : null}

      </div>
    </>
  )
}
