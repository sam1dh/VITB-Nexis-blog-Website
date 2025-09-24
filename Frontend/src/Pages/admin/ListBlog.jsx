import React, { useState, useEffect } from 'react'
import BlogTableItem from '../../Components/admin/BlogTableItem';
import { blog_data } from '../../Assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { axios } = useAppContext()

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/blogs')
      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on search and status
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.subTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && blog.isPublished) ||
                         (filterStatus === 'draft' && !blog.isPublished);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='min-h-screen  p-4 md:p-8 w-full'>
      <div className='max-w-7xl mx-auto space-y-6'>
        
        {/* Header Section */}
        <div className='text-center mb-8 '>
          <h1 className='text-4xl md:text-5xl p-4 font-bold bg-primary bg-clip-text text-transparent mb-4 '>
            Blog Management
          </h1>
          <p className='text-gray-600 text-lg'>Manage and organize all your blog posts</p>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50'>
            <div className='flex items-center space-x-4'>
              <div className='bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full text-white'>
                <span className='text-2xl'>📚</span>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600 uppercase tracking-wide'>Total Blogs</p>
                <p className='text-2xl font-bold text-gray-800'>{blogs.length}</p>
              </div>
            </div>
          </div>

          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50'>
            <div className='flex items-center space-x-4'>
              <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full text-white'>
                <span className='text-2xl'>✅</span>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600 uppercase tracking-wide'>Published</p>
                <p className='text-2xl font-bold text-gray-800'>{blogs.filter(blog => blog.isPublished).length}</p>
              </div>
            </div>
          </div>

          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50'>
            <div className='flex items-center space-x-4'>
              <div className='bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-full text-white'>
                <span className='text-2xl'>📝</span>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600 uppercase tracking-wide'>Drafts</p>
                <p className='text-2xl font-bold text-gray-800'>{blogs.filter(blog => !blog.isPublished).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <span className='text-gray-400'>🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search blogs by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white'
                />
              </div>
            </div>
            
            <div className='flex items-center space-x-4'>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white'
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
              
              <button
                onClick={fetchBlogs}
                disabled={loading}
                className='px-6 py-3 bg-primary/90 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Refreshing...</span>
                  </div>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <span>Refresh</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm || filterStatus !== 'all' ? (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <p className='text-blue-800 font-medium'>
              Showing {filteredBlogs.length} of {blogs.length} blogs
              {searchTerm && ` matching "${searchTerm}"`}
              {filterStatus !== 'all' && ` with status: ${filterStatus}`}
            </p>
          </div>
        ) : null}

        {/* Main Blog Table */}
        <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden'>
          <div className='bg-primary/80 px-8 py-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='bg-white p-2 rounded-lg'>
                  <span className='text-white text-xl'>📋</span>
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-white'>All Blog Posts</h2>
                  <p className='text-white'>Manage your content library</p>
                </div>
              </div>
              <div className='text-white text-sm'>
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            {loading ? (
              <div className='flex items-center justify-center py-20'>
                <div className='text-center space-y-4'>
                  <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto'></div>
                  <p className='text-white font-medium'>Loading your blogs...</p>
                </div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className='flex items-center justify-center py-20'>
                <div className='text-center space-y-4'>
                  <div className='text-6xl opacity-20'>
                    {searchTerm || filterStatus !== 'all' ? '🔍' : '📝'}
                  </div>
                  <div className='text-white'>
                    <p className='text-lg font-medium'>
                      {searchTerm || filterStatus !== 'all' 
                        ? 'No blogs match your search criteria' 
                        : 'No blogs found'
                      }
                    </p>
                    <p className='text-sm'>
                      {searchTerm || filterStatus !== 'all'
                        ? 'Try adjusting your search terms or filters'
                        : 'Start by creating your first blog post!'
                      }
                    </p>
                  </div>
                  {(searchTerm || filterStatus !== 'all') && (
                    <button
                      onClick={() => {setSearchTerm(''); setFilterStatus('all')}}
                      className='mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/45 transition-colors'
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <table className='w-full'>
                <thead className='bg-gray-50/80 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      #
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Blog Title
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden'>
                      Date
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredBlogs.map((blog, index) => (
                    <BlogTableItem 
                      key={blog._id} 
                      blog={blog}
                      fetchBlogs={fetchBlogs} 
                      index={index + 1} 
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Action Footer */}
        {filteredBlogs.length > 0 && (
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50'>
            <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
              <div className='text-gray-600'>
                <p className='font-medium'>
                  Total: {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
                </p>
                <p className='text-sm text-gray-500'>
                  {blogs.filter(blog => blog.isPublished).length} published, {blogs.filter(blog => !blog.isPublished).length} drafts
                </p>
              </div>
              
              <div className='flex items-center space-x-3'>
                <div className='text-sm text-gray-500'>
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListBlog