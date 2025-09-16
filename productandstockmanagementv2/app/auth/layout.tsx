
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='min-h-screen flex items-center justify-center '>
     
      {/* Mobile view */}
      <div className=' w-full md:w-md    '>
        <div className=''>
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout