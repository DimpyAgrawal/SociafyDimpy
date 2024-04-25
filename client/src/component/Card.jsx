import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Comment from './Comment';
import axios from 'axios';

export default function Card({ post }) {
    const postId = post._id;
    console.log('postId ', postId);

    let userId = localStorage.getItem('id');
    console.log('userId ', userId);
    const navigate = useNavigate();
    const [showComment, setShowComment] = useState(false);
    const [liked, setLiked] = useState(post.likes.includes(userId));
    const [length, setLength] = useState(post.likes.length);

    const handleComment = () => {
        setShowComment(true);
    }

    const submitLike = async () => {

        console.log('inside submitLike');
        try {
            await axios.put('http://localhost:8080/post/saveLike', { postId, userId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setLiked(true);
            setLength((a) => a + 1);

        } catch (error) {
            console.log('Error submitting like', error);
        }
    };

    const submitUnLike = async () => {
        console.log('inside submitUnLike function');
        try {
            await axios.put('http://localhost:8080/post/saveunLike', { postId, userId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setLiked(false);
            setLength((a) => a - 1);
        } catch (error) {
            console.log('Error submitting unlike', error);
        }
    };

    return (
        <>
            <div className='flex m-auto w-full h-full  '>
                <div className='md:w-[30%] flex flex-col sm:[50%] w-[100%] border-b-2 pb-4 m-auto h-[80%] mt-[1%] '>
                    <div
                        className='flex cursor-pointer pl-2 '
                        onClick={() => {
                            if (post.postedBy) {
                                navigate('/profile', { state: { ID: post.postedBy._id } });
                            }
                        }}
                    >
                        <div><img className='mt-2 rounded-full h-10 w-10' src={post.postedBy ? post.postedBy.photo : "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg"} alt="" /></div>
                        <div className='ml-5 m-auto'>{post.postedBy && post.postedBy.name}</div>
                    </div>

                    <div className='mt-[1%] h-[25rem] bg-black rounded-md '><img className='object-contain h-full  m-auto ' src={post.photo ? post.photo : "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg"} alt="" /> </div>

                    <div className='flex flex-col '>

                        <div className='flex pl-2 mt-3 gap-2'>
                            {liked ? (
                                <img className='h-4 mt-1 cursor-pointer' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQweT4AlC1jWCpV262m0ZNUFevJdincbFSk9lC2MqDgNw&s" alt="" onClick={submitUnLike} />
                            ) : (

                                <span className="material-symbols-outlined cursor-pointer" onClick={submitLike} >
                                    favorite
                                </span>



                            )}
                            <span>{length} Likes</span>

                            <div className="material-symbols-outlined cursor-pointer" onClick={handleComment}>comment</div>
                            <div> {showComment && <Comment post={post} setShowComment={setShowComment} />}</div>

                        </div>
                        <div className=' w-full pl-2 flex-wrap mt-2  '> Caption:  {post.body}</div>
                    </div>
                </div>
            </div>
        </>
    );
}