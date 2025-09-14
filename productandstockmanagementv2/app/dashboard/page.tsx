import { WelcomeMsg } from '@/components/ui/custom/Greeting'
import React from 'react'

const dashboard = () => {
  return (
    <div className='flex items-end-safe justify-end'>
      <div>
        <WelcomeMsg/>
      </div>
    </div>
  )
}

export default dashboard
