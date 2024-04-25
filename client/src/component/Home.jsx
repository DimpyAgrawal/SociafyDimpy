import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');


  const fetchAllPosts = async (id) => {
    try {
      const response = await axios.get('http://localhost:8080/post/allposts', {
        headers: {
          "Content-Type": 'application/json',
           Authorization: `Bearer ${token}`, 
        },
      });
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
           console.log('error '+error);
    }
  };


  useEffect(() => {
    fetchAllPosts();
  }, []);
  


  return (
    <div className='mt-12'>
      {posts && posts.map((post) => (
        <div className='' key={post._id}>
          <Card post={post}/>
        </div>
      ))}
    </div>
  );
}
