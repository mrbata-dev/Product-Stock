'use client'
import { useSession } from 'next-auth/react';
import React from 'react'

export const WelcomeMsg = () => {
    const{data:session, status} = useSession();
    if(status == 'loading')
    {
      return(
        <div className="m-4 h-12 w-50 bg-gray-200 rounded-md animate-pulse" />
      )
    }
    const GetGreeting = () => {
        const now = new Date();
    const hours = now.getHours();
    if(hours >= 5 && hours< 12) return "Good Morning";
    if(hours >= 12 && hours< 18) return "Good Afternoon";
    if(hours >= 17 && hours< 21) return "Good Evening";
    return "Good Night";
    }

  return (
    <div className=' px-4 mt-8 text-left w-full'>
      <h1 className='text-md font-bold'>{GetGreeting()}, <br /> <span className='text-2xl md:text-4xl font-bold'>{session?.user?.name}👋</span></h1>
    </div>
  )
}


