  import axios from 'axios';
  import React, { useState } from 'react'
  import { useNavigate } from 'react-router-dom';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  export default function CreatePost() {
    const notify1 = (msg) => toast.success(msg);
    const notify4 = (msg) => toast.error(msg);
    const notify2 = (msg) => toast.info(msg);
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
      setImage(event.target.files[0]);
    };


    const submitImage = async () => {
      try {
        if (!image) {
          notify4('Missing image, Upload again');
          return;
        }
        notify2('uploding your Post please wait...')
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'insta_clone');
        formData.append('cloud_name', 'dtjc6fasp');
        // console.log({formData});

        const response = await axios.post('https://api.cloudinary.com/v1_1/dtjc6fasp/image/upload', formData);
          console.log(response.data.url);
        console.log('Image uploaded successfully:', response.data.url);

        // Once the image is uploaded, you can proceed to create the post
        createPost(response.data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    const createPost = async (imageUrl) => {
      console.log(body + " gggg " + imageUrl);
      try {
        if (!body || !imageUrl) {
          notify4('mention complete details');
          return;
        }
        const token = localStorage.getItem('token');
        const response = await axios.post
        ('http://localhost:8080/post/posts',
          {
            body: body,
            image: imageUrl
          }, {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`, 
          }
        }
        );
        notify1('post is created successfully');
        navigate('/');
        console.log('post created successfully');

        setBody('');
        setImage(null);
      } catch (error) {
        console.log('error is ', error);
      }
    }
    return (
      <>
      {/* bg-[url("https://www.shutterstock.com/image-photo/dark-graphite-grey-abstract-textured-600nw-2186292063.jpg")]  */}
        <div className='w-[100vw] h-[92vh]  bg-no-repeat bg-cover bg-center mt-14'>
          <div className='md:w-[30%] bg-gray-100 rounded  sm:w-[50%] flex flex-col w-[90%] m-auto'>
            <h1 className='m-auto text-3xl mt-[10%] font-bold'>Create New Post</h1>
            <div className='p-2 mt-0  text-black gap-5 flex flex-col pl-10'>
              <p className=''>Write your message here...</p>
              <input type="text" value={body} onChange={(e) => setBody(e.target.value)} placeholder='write a caption...' className='bg-white pl-2 text-black border-2 border-gray-400 w-[95%] rounded-md h-[40px]' />
              <p>Attach Document here</p>

              <div className="flex items-center justify-center w-full pr-8">
                <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" onChange={handleFileChange} type="file" className="hidden" />
                </label>
              </div>

              <button onClick={submitImage} className='bg-blue-500 w-[95%] rounded-lg mr-10'>Upload</button>
            </div>
          </div>
        </div>

      </>
    )
  }

