import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { assets, blog_data, comments_data } from '../Assets/assets';
import moment from 'moment';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Blog = () => {
  const { id } = useParams();

  const {axios} = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  // TF-IDF Implementation
  const calculateTFIDF = (documents) => {
    // Tokenize and preprocess text
    const tokenize = (text) => {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);
    };

    // Calculate Term Frequency
    const calculateTF = (tokens) => {
      const tf = {};
      const totalTokens = tokens.length;
      
      tokens.forEach(token => {
        tf[token] = (tf[token] || 0) + 1;
      });
      
      // Normalize by total tokens
      Object.keys(tf).forEach(term => {
        tf[term] = tf[term] / totalTokens;
      });
      
      return tf;
    };

    // Calculate Document Frequency
    const calculateDF = (documents) => {
      const df = {};
      const vocabulary = new Set();
      
      documents.forEach(doc => {
        const uniqueTokens = new Set(doc.tokens);
        uniqueTokens.forEach(token => {
          vocabulary.add(token);
          df[token] = (df[token] || 0) + 1;
        });
      });
      
      return { df, vocabulary };
    };

    // Calculate IDF
    const calculateIDF = (df, totalDocs) => {
      const idf = {};
      Object.keys(df).forEach(term => {
        idf[term] = Math.log(totalDocs / df[term]);
      });
      return idf;
    };

    // Process documents
    const processedDocs = documents.map(doc => ({
      ...doc,
      tokens: tokenize(doc.title + ' ' + doc.subTitle + ' ' + doc.category),
    }));

    const { df, vocabulary } = calculateDF(processedDocs);
    const idf = calculateIDF(df, processedDocs.length);

    // Calculate TF-IDF vectors
    const tfidfVectors = processedDocs.map(doc => {
      const tf = calculateTF(doc.tokens);
      const vector = {};
      
      vocabulary.forEach(term => {
        const tfValue = tf[term] || 0;
        const idfValue = idf[term] || 0;
        vector[term] = tfValue * idfValue;
      });
      
      return {
        ...doc,
        vector
      };
    });

    return { tfidfVectors, vocabulary };
  };

  // Calculate Cosine Similarity
  const cosineSimilarity = (vectorA, vectorB, vocabulary) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    vocabulary.forEach(term => {
      const a = vectorA[term] || 0;
      const b = vectorB[term] || 0;
      
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    });

    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  // Get recommendations based on TF-IDF and Cosine Similarity
  const getRecommendations = (currentArticleId, numRecommendations = 3) => {
    if (!blog_data || blog_data.length < 2) return [];

    const { tfidfVectors, vocabulary } = calculateTFIDF(blog_data);
    
    // Find current article vector
    const currentArticle = tfidfVectors.find(article => article._id === currentArticleId);
    if (!currentArticle) return [];

    // Calculate similarities with all other articles
    const similarities = tfidfVectors
      .filter(article => article._id !== currentArticleId)
      .map(article => ({
        ...article,
        similarity: cosineSimilarity(currentArticle.vector, article.vector, vocabulary)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, numRecommendations);

    return similarities;
  };

  const fetchBlogData = async () => {
    try {
        const { data } = await axios.get(`/api/blog/${id}`)
        data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
        toast.error(error.message)
    }
};

  const fetchComments = async () => {
    try {
        const { data } = await axios.post('/api/blog/comments', { blogId: id })
        if (data.success) {
            setComments(data.comments)
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

  const fetchRecommendations = () => {
    const recommendations = getRecommendations(id, 3);
    setRecommendedArticles(recommendations);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post('/api/blog/add-comment', { blog: id, name, content });
        if (data.success) {
            toast.success(data.message)
            setName('')
            setContent('')
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

  useEffect(() => {
    fetchBlogData();
    fetchComments();
    fetchRecommendations();
  }, [id]);

  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
      <Navbar/>
      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium '>Published on {moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
      </div>
      
      <div className='mx-5 max-w-4xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5'/>
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{__html: data.description}}></div>
      </div>

      {/* Recommended Articles Section */}
      {recommendedArticles.length > 0 && (
        <div className='max-w-4xl mx-auto mt-16 mb-10 px-5'>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Recommended Articles</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recommendedArticles.map((article, index) => (
              <div key={article._id} className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                <Link to={`/blog/${article._id}`}>
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className='w-full h-48 object-cover hover:scale-105 transition-transform duration-300'
                  />
                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs text-primary bg-primary/10 px-2 py-1 rounded-full'>
                        {article.category}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {Math.round(article.similarity * 100)}% match
                      </span>
                    </div>
                    <h3 className='font-semibold text-gray-800 text-sm mb-2 line-clamp-2 hover:text-primary transition-colors'>
                      {article.title}
                    </h3>
                    <p className='text-gray-600 text-xs line-clamp-2 mb-3'>
                      {article.subTitle}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs text-gray-500'>
                        {moment(article.createdAt).format('MMM DD, YYYY')}
                      </span>
                      <span className='text-xs text-primary font-medium hover:underline'>
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='mt-16 mb-12 max-w-4xl mx-auto px-5'>
        {/* Comments Header */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full'></div>
          <div>
            <h3 className='text-2xl font-bold text-gray-800'>Discussion</h3>
            <p className='text-gray-500 text-sm'>{comments?.length || 0} {comments?.length === 1 ? 'comment' : 'comments'}</p>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6 mb-12">
          {comments?.map((item, index) => (
            <div key={index} className='group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20'>
              {/* Comment Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className='relative'>
                  <div className='w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center'>
                    <img src={assets.user_icon} alt="" className='w-7 h-7 opacity-80'/>
                  </div>
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-1'>
                    <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                    <span className='px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium'>Verified</span>
                  </div>
                  <p className='text-gray-500 text-sm flex items-center gap-2'>
                    <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                    {moment(item.createdAt).fromNow()}
                  </p>
                </div>
              </div>

              {/* Comment Content */}
              <div className='ml-16'>
                <p className='text-gray-700 leading-relaxed text-base'>{item.content}</p>
                
                {/* Comment Actions */}
                <div className='flex items-center gap-6 mt-4 pt-3 border-t border-gray-50'>
                  <button className='flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'></path>
                    </svg>
                    Like
                  </button>
                  <button className='flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'></path>
                    </svg>
                    Reply
                  </button>
                  <button className='flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'></path>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {(!comments || comments.length === 0) && (
            <div className='text-center py-12'>
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'></path>
                </svg>
              </div>
              <h4 className='text-lg font-semibold text-gray-600 mb-2'>No comments yet</h4>
              <p className='text-gray-500'>Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Add Comment Form */}
        <div className='bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-3xl p-8 border border-gray-100'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full'></div>
            <h3 className='text-xl font-bold text-gray-800'>Join the conversation</h3>
          </div>
          
          <form onSubmit={addComment} className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Your Name</label>
                <input 
                  type="text" 
                  onChange={(e)=>setName(e.target.value)}
                  placeholder="Enter your full name" 
                  required 
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white'
                />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Email (Optional)</label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white'
                />
              </div>
            </div>
            
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Your Comment</label>
              <textarea 
                onChange={(e)=>(setContent(e.target.value))}
                placeholder="Share your thoughts, feedback, or questions about this article..." 
                className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white resize-none' 
                rows="5"
                required
              />
              <p className='text-xs text-gray-500'>Please be respectful and constructive in your comments.</p>
            </div>
            
            <div className='flex items-center justify-between pt-2'>
              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="checkbox" className='rounded border-gray-300 text-primary focus:ring-primary/20' />
                  <span>Notify me of replies</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className='bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'></path>
                </svg>
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : <div>Loading...</div>
}

export default Blog