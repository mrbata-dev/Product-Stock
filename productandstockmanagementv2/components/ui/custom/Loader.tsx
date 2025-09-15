import React from 'react'

const LoadingPage = () => {
  return (
    <div className="text-center  items-center justify-center flex flex-col">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading product...</p>
        </div>
  )
}

export default LoadingPage
