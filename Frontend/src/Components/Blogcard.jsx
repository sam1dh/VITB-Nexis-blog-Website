import React from 'react'

const Blogcard = ({blog}) => {
    const {title, description, image, category, _id} = blog;
  return (
    <div onClick={()=>window.location=`/blog/${_id}`} className = 'w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer'>
        <img src={image} alt={title} className='aspect-video'/>
        <span className='ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs'>{category}</span>
        <div className='p-5'>
            <h5 className='mb-2 font-medium tex-gray-900'>{title}</h5>
            <p className='mb-3 text-xs text-gray-600' dangerouslySetInnerHTML={{"__html" : description.slice(0,80)}}></p>
        </div>
    </div>
  )
}

export default Blogcard