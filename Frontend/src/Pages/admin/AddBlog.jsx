import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../Assets/assets'
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddBlog = () => {
  const { axios } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('startup');
  const [isPublished, setIspublished] = useState(false);

  const generateContent = async () => {
    // Keep original functionality
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true)

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await axios.post('/api/blog/add', formData);

      if (data.success) {
        toast.success(data.message);
        setImage(false)
        setTitle('')
        setSubTitle('')
        quillRef.current.root.innerHTML = ''
        setCategory('startup')
        setIspublished(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    // Initiate Quill only used
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  })

  return (
    <div className='min-h-screen w-full  p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold  bg-primary bg-clip-text text-transparent mb-2'>
            Create New Blog Post
          </h1>
          <p className='text-gray-600 text-lg'>Share your thoughts and ideas with the world</p>
        </div>

        <div className='space-y-8'>
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
            <div className='bg-gradient-to-r bg-primary/80 px-8 py-6'>
              <h2 className='text-2xl font-semibold text-white'>Blog Details</h2>
            </div>
            
            <div className='p-8 space-y-8'>
              {/* Thumbnail Upload Section */}
              <div className='space-y-4'>
                <label className='block text-sm font-semibold text-gray-700 mb-3'>
                  📷 Upload Thumbnail
                </label>
                <div className='flex items-center justify-center w-full'>
                  <label htmlFor="image" className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/15 rounded-xl cursor-pointer bg-primary/10 hover:bg-primary/15 transition-colors duration-300 group'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      {!image ? (
                        <>
                          <div className='w-10 h-10 mb-3 text-primary group-hover:text-primary'>
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <p className='mb-2 text-sm text-primary group-hover:text-primary'>
                            <span className='font-semibold'>Click to upload</span> or drag and drop
                          </p>
                          <p className='text-xs text-primary'>PNG, JPG or WEBP (MAX. 800x400px)</p>
                        </>
                      ) : (
                        <div className='relative'>
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt="Preview" 
                            className='h-24 rounded-lg object-cover shadow-md'
                          />
                          <div className='absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1'>
                            <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" name="" id="image" hidden required />
                  </label>
                </div>
              </div>

              {/* Title and Subtitle Section */}
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-gray-700'>
                    ✏️ Blog Title
                  </label>
                  <input 
                    type="text" 
                    placeholder='Enter an engaging title...' 
                    required 
                    className='w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white' 
                    onChange={e => setTitle(e.target.value)} 
                    value={title} 
                  />
                </div>
                
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-gray-700'>
                    📝 Subtitle
                  </label>
                  <input 
                    type="text" 
                    placeholder='Add a compelling subtitle...' 
                    required 
                    className='w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white' 
                    onChange={e => setSubTitle(e.target.value)} 
                    value={subTitle} 
                  />
                </div>
              </div>

              {/* Blog Content Editor */}
              <div className='space-y-4'>
                <label className='block text-sm font-semibold text-gray-700'>
                  📄 Blog Content
                </label>
                <div className='border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm'>
                  <div className='h-80 relative'>
                    <div ref={editorRef} className='h-full'></div>
                  </div>
                </div>
              </div>

              {/* Category and Publishing Options */}
              <div className='grid md:grid-cols-2 gap-6 items-end'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-gray-700'>
                    🏷️ Category
                  </label>
                  <select 
                    onChange={e => setCategory(e.target.value)} 
                    value={category}
                    className='w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white'
                  >
                    <option value="">Select Category</option>
                    {blogCategories.map((item, index) => {
                      return <option key={index} value={item}>{item}</option>
                    })}
                  </select>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200'>
                    <input 
                      type="checkbox" 
                      id="publish-toggle"
                      checked={isPublished} 
                      className='w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500' 
                      onChange={e => setIspublished(e.target.checked)} 
                    />
                    <label htmlFor="publish-toggle" className='text-sm font-semibold text-gray-700 cursor-pointer'>
                      🚀 Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className='pt-6 border-t border-gray-200'>
                <button 
                  disabled={isAdding} 
                  onClick={onSubmitHandler}
                  className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                    isAdding 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary/70 text-white shadow-lg'
                  }`}
                >
                  {isAdding ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Publishing...</span>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center space-x-2'>
                      <span>Publish Blog</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  )
}


export default AddBlog;