import React, { useEffect, useState } from 'react'
import { comments_data } from '../../Assets/assets';
import CommonTableItem from '../../Components/admin/CommonTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('Not Approved');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { axios } = useAppContext();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/comments')
      data.success ? setComments(data.comments) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  // Filter comments based on approval status and search term
  const filteredComments = comments.filter((comment) => {
    const matchesStatus = filter === "Approved" 
      ? comment.isApproved === true 
      : comment.isApproved === false;
    
    const matchesSearch = !searchTerm || 
      comment.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const approvedCount = comments.filter(comment => comment.isApproved === true).length;
  const notApprovedCount = comments.filter(comment => comment.isApproved === false).length;

  return (
    <div className="min-h-screen  p-4 md:p-8 w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-primary bg-clip-text text-transparent mb-3 p-4">
            Comments Management
          </h1>
          <p className="text-gray-600 text-lg">Review and moderate user comments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="bg-primary p-3 rounded-full text-white">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Comments</p>
                <p className="text-2xl font-bold text-gray-800">{comments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full text-white">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Approved</p>
                <p className="text-2xl font-bold text-gray-800">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full text-white">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{notApprovedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search comments, authors, or blog titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-full p-1 shadow-inner">
                <button
                  onClick={() => setFilter('Approved')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === 'Approved'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  ✅ Approved ({approvedCount})
                </button>
                <button
                  onClick={() => setFilter('Not Approved')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === 'Not Approved'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  ⏳ Pending ({notApprovedCount})
                </button>
              </div>

              <button
                onClick={fetchComments}
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium  transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Refreshing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Refresh</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Showing {filteredComments.length} of {comments.filter(comment => 
                filter === "Approved" ? comment.isApproved === true : comment.isApproved === false
              ).length} {filter.toLowerCase()} comments
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Main Comments Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className={`px-8 py-6 ${
            filter === 'Approved' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-orange-500 to-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <span className="text-white text-xl">
                    {filter === 'Approved' ? '✅' : '⏳'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {filter} Comments
                  </h2>
                  <p className="text-white">
                    {filter === 'Approved' 
                      ? 'Comments that are live on your site' 
                      : 'Comments waiting for your review'
                    }
                  </p>
                </div>
              </div>
              <div className="text-white text-sm">
                {filteredComments.length} {filteredComments.length === 1 ? 'comment' : 'comments'}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 font-medium">Loading comments...</p>
                </div>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="text-6xl opacity-20">
                    {searchTerm ? '🔍' : filter === 'Approved' ? '✅' : '⏳'}
                  </div>
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">
                      {searchTerm 
                        ? 'No comments match your search' 
                        : `No ${filter.toLowerCase()} comments found`
                      }
                    </p>
                    <p className="text-sm">
                      {searchTerm 
                        ? 'Try adjusting your search terms'
                        : filter === 'Approved' 
                          ? 'No comments have been approved yet'
                          : 'All comments have been reviewed!'
                      }
                    </p>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Blog Title & Comment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-sm:hidden">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComments.map((comment, index) => (
                    <CommonTableItem 
                      key={comment._id} 
                      comment={comment} 
                      index={index + 1} 
                      fetchComments={fetchComments} 
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Summary Footer */}
        {filteredComments.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-gray-600">
                <p className="font-medium">
                  Showing {filteredComments.length} {filter.toLowerCase()} comment{filteredComments.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500">
                  Total: {approvedCount} approved, {notApprovedCount} pending review
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
                {notApprovedCount > 0 && filter === 'Not Approved' && (
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                    {notApprovedCount} need{notApprovedCount === 1 ? 's' : ''} review
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comments