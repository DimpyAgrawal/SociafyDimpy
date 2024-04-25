import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePic({ changeProfile }) {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const notify1 = () => toast.success("Photo uploaded successfully");
  const notify2 = (msg) => toast.info(msg);
  const notify4 = (msg) => toast.error(msg);

  const submitImage = () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'insta_clone');
      formData.append('cloud_name', 'dtjc6fasp');

      notify2('Image is Uploading Please Wait...')
      
      axios.post('https://api.cloudinary.com/v1_1/dtjc6fasp/image/upload', formData)
        .then((response) => {
          console.log(response.data.url);
          saveImageInDB(response.data.url);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      notify4('Please select an image before uploading.');
    }
  };

 const saveImageInDB = (imageUrl) => {
    console.log(imageUrl);

    axios.put('http://localhost:8080/setImageToDB', {
        pic: imageUrl,
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }
    }).then((response) => {
        console.log('saveimagedb', imageUrl);
        console.log(response.data);

        // Check if response.data.Photo is present before updating local storage
        if (response.data.Photo) {
            localStorage.setItem('Photo', response.data.Photo);
        }

        changeProfile();
        notify1();
        window.location.reload();
    }).catch((error) => {
        console.error('Error in API request:', error);
    });
};

const deleteFromDB =()=>{
  

}

  

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  }

  return (
    <>
       <div className='flex w-[100vw] h-[100vh] bg-gray-700 bg-opacity-70 fixed top-0 left-0'>
        <div className='flex flex-col m-auto  w-[23%] rounded-md p-4 bg-white'>
          <div>

            <div class="flex items-center justify-center w-full">
              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" onChange={(e) => setImage(e.target.files[0])} ref={hiddenFileInput} class="hidden" />
              </label>
            </div>

          </div>
          <div className='flex flex-col gap-y-3'>

          <div  onClick={submitImage} className='bg-blue-700 mt-3 w-full m-auto flex justify-center rounded-md'><button >Upload</button></div>
          {/* <div 
           onClick={()=>{
            // setImage(null);
            // setUrl(null);
            deleteFromDB();
          }}
          className='bg-red-600 flex w-full m-auto justify-center rounded-md'><button
          
          >Delete Profile Photo</button></div> */}
          <div onClick={changeProfile} className='bg-blue-300 w-full  m-auto flex justify-center rounded-md'><button >Cancel </button></div>
          </div>
        </div>
      </div>
    </>
  );
}
