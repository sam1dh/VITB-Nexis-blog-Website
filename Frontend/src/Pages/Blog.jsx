import React, { use, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
// import { useEffect } from 'react';
import { blog_data } from '../Assets/assets';
const Blog = () => {
  const { id } = useParams();
  const [data, setDate] = useState(null);
  const fetchblogData = async () => {
    const data = blog_data.find(item => item._id === id);
    setDate(data);
  }
useEffect (()=>{
    fetchblogData();
},[])
  return data ? (
    <div>Blog</div>
   ) : <div>Loading...</div>
  
}

export default Blog