import Image from 'next/image'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <div className='lg:flex bg-white shadow-2xl gap-x-0 w-full max-w-6xl hidden rounded-3xl overflow-hidden'>
        {/* Left Panel - Welcome Section */}
        <div className='flex-1 p-12 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white'>
          <div className='max-w-md'>
            {/* Logo Section */}
            <div className='mb-8'>
              <div className='w-24 h-24 bg-black rounded-2xl flex items-center justify-center mb-6'>
                <Image
                  src={'/logo.svg'}
                  alt="logo"
                  width={40}
                  height={40}
                  className='w-10 h-10 filter invert'
                />
              </div>
            </div>
            
            {/* Welcome Text */}
            <div className='space-y-6'>
              <h1 className='text-5xl font-bold text-gray-900 leading-tight'>
                Welcome Back!
              </h1>
              <p className='text-lg text-gray-600 leading-relaxed'>
                Join thousands of users who trust our platform for secure and seamless authentication. 
                Experience the perfect blend of security and simplicity.
              </p>
              
              {/* Feature highlights */}
              <div className='space-y-3 pt-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-black rounded-full'></div>
                  <span className='text-sm text-gray-700'>Secure & encrypted</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-black rounded-full'></div>
                  <span className='text-sm text-gray-700'>Fast authentication</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-black rounded-full'></div>
                  <span className='text-sm text-gray-700'>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Form Section */}
        <div className='flex-1 bg-black relative overflow-hidden'>
          {/* Subtle pattern overlay */}
          <div className='absolute inset-0 opacity-5'>
            <div className='absolute inset-0' style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          {/* Content */}
          <div className='relative z-10 h-full flex items-center justify-center p-8'>
            {children}
          </div>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className='lg:hidden w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden'>
        <div className='bg-black p-8'>
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout