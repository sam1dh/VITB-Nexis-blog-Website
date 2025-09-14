import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { assets, blog_data, comments_data } from '../Assets/assets';
import moment from 'moment';

const Blog = () => {
  const { id } = useParams();
  const [data, setDate] = useState(null);
  const [comments, setComments] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);

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

  const fetchblogData = async () => {
    const data = blog_data.find(item => item._id === id);
    setDate(data);
  };

  const fetchComments = async () => {
    setComments(comments_data);
  };

  const fetchRecommendations = () => {
    const recommendations = getRecommendations(id, 3);
    setRecommendedArticles(recommendations);
  };

  const addComment = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    fetchblogData();
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
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary '>Michael Brown</p>
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

      <div className='mt-14 mb-10 max-w-3xl mx-auto px-5'>
        <p className='font-semibold mb-4'>Comments ({comments?.length || 0})</p>
        <div className="flex flex-col gap-4">
          {comments?.map((item, index) => (
            <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
              <div className="flex items-center gap-2 mb-2">
                <img src={assets.user_icon} alt="" className='w-6'/>
                <p className="font-medium">{item.name}</p>
              </div>
              <p className='text-sm max-w-md ml-8'>{item.content}</p>
              <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                {'~ '}{moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>

        <div className='max-w-3xl mx-auto mt-8'>
          <p className='font-semibold mb-4'>Add your comment</p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <input 
              type="text" 
              placeholder="Name" 
              required 
              className='w-full p-2 border border-gray-300 rounded outline-none'
            />
            <textarea 
              placeholder='Comment' 
              className='w-full p-2 border border-gray-300 rounded outline-none h-48' 
              required
            />
            <button 
              type="submit" 
              className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : <div>Loading...</div>
}

export default Blog