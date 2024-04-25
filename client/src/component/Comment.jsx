import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Comment({ post ,setShowComment }) {
  const navigate = useNavigate();

  console.log(post);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(true);
  // const[crossModal,setCrossModal] = useState(flase);

  const postId = post._id;
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const photo = post.postedBy.photo;
  const name = post.postedBy.name;
  console.log(postId + " " + userId + " " + token);

console.log(name+" "+photo);

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    console.log(postId + " " + comment);
    try {
      console.log('inside handle comment');
      const response = await axios.post(
        'http://localhost:8080/post/addComment',
        { comment, postId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const updatedComments = response.data.comments;
      setComments(updatedComments);
      setComment('');


      console.log(response);
      fetchCommentData(postId);
      // getAllComments(postId);
    } catch (error) {
      console.log('Error in comment route', error);
      console.log('Inside handle comment');
    }
  };




  const fetchCommentData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/post/commentData/${id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      console.log(response.data);
      const userComments = response.data;
      setComments(userComments);
    } catch (error) {
      console.log('Fetch comment data error', error);
    }
  };


  useEffect(() => {
    fetchCommentData(postId);
  }, [userId, token, postId]);


  return (
    <>
      <div className='flex flex-col w-[100vw] h-[100vh] m-auto  bg-gray-700 bg-opacity-70 fixed top-0 left-0'  onClick={()=>setShowComment(false)}>
    
        <div className='flex rounded-md mt-10 h-[80%] flex-col m-auto w-[25%] bg-white overflow-auto' onClick={(event) => event.stopPropagation()}>

          <div className='flex mt-3 p-3 '>
            <p><img  className='h-10 w-10 rounded-full ' src={photo} alt="" /></p>
            <p className=' m-auto ml-3'>{name}</p>
          </div>
            {/* <p className='ml-4 mt-3 mb-3 font-bold'>Comments</p> */}
            <hr className='border-2' />
          <div className=' custom-scrollbar overflow-auto'>
          {comments && comments.map((data, index) => (
            <div key={index} className='flex p-4'>
              <div className='mt-2'> <img className='rounded-full w-7 h-7 m-auto '
                onClick={() => {
                  if (data.postedBy._id) {
                    navigate('/profile', { state: { ID: data.postedBy._id } });
                  }
                }}
                src={data.postedBy.photo} alt='' /> </div>
              <div className='pt-2 pl-3'>
                <p className='font-semibold font-serif text-xs'>{data.postedBy.name}</p>
                <p className='text-sm'>{data.comment}</p>
                </div>
            </div>
          ))}
          </div>


         

          <div className='flex justify-between  p-5 '>
            <input
              type='text'
              value={comment}
              name='comment'
              onChange={(e) => handleComment(e)}
              className='border-2  p-1 border-gray-500 rounded-full w-full mr-[10%]'
              placeholder='Write your comment here'
            />
            <span class="material-symbols-outlined cursor-pointer mt-1 mr-5" onClick={(e) => submitComment(e)}>send</span>
            
          </div>
        </div>
      </div>
    </>
  );
}
