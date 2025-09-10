import React from 'react'
import { assets } from '../Assets/assets'

const header = () => {
  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative overflow-hidden'>
        <div className='text-center mt-20 mb-8 animate-fade-in'>
            <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 border border-primary/40 bg-primary/5 rounded-full text-primary text-sm mb-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:bg-primary/10 animate-bounce-gentle backdrop-blur-sm'>
            <p className='font-medium'>Vit Bhopal : A chance to grow </p>
            <img src={assets.star_icon} className='w-2.5 animate-spin-slow hover:animate-pulse' alt="" />
            </div>
            <h1 className='text-3xl sm:text-6xl font-bold sm:leading-tight text-gray-800 animate-slide-up-delay bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
              Your <span className='text-primary bg-gradient-to-r from-primary to-purple-600 bg-clip-text animate-gradient-shift font-extrabold drop-shadow-sm'>College News</span><br/> 
              & Magazine Hub
            </h1>
            <p className='my-6 sm:my-8 max-w-2xl mx-auto max-sm:text-xs text-gray-600 leading-relaxed animate-fade-in-up font-medium hover:text-gray-700 transition-colors duration-300'>
              Discover the ultimate college news and magazine hub! Dive into fresh, engaging articles crafted for students. Join our vibrant platform to share stories that spark inspiration!
            </p>
          <form className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border-2 border-gray-200/60 bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/40 focus-within:border-primary/60 focus-within:bg-white/90 animate-search-appear'>
            <input type="text" placeholder='Search for Blogs' required className='w-full pl-6 pr-4 py-4 outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium text-sm focus:placeholder-gray-300 transition-all duration-200' />
            <button type='submit' className='bg-gradient-to-r from-primary to-primary px-8 text-white py-2 m-2 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer font-semibold text-sm active:scale-95 hover:from-primary hover:to-primary'>Search</button>
          </form>
        </div>
        <img 
          src={assets.gradientBackground} 
          alt="" 
          className='absolute -top-50 -z-10 opacity-30 animate-float hover:opacity-40 transition-opacity duration-700 filter blur-sm hover:blur-none' 
        />
        <style jsx>{`
          @keyframes search-appear {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-up-delay {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
          }
          
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-search-appear {
            animation: search-appear 1s ease-out 0.6s both;
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-slide-up-delay {
            animation: slide-up-delay 1s ease-out 0.2s both;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out 0.4s both;
          }
          
          .animate-bounce-gentle {
            animation: bounce-gentle 3s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
          }
        `}
        </style>
    </div>
  )
}

export default header