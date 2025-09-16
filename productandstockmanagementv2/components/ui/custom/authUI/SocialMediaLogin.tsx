import React from 'react'
import { Button } from '../../button'
import Image from 'next/image'
import {  motion } from "motion/react"
import { signIn } from 'next-auth/react'
const SocialMediaLogin = () => {
  return (
    <div>
       <motion.div
          className='w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant={'outline'}
              className='w-full py-6 bg-transparent border border-gray-700 text-black
                       hover:bg-black hover:text-white hover:border-gray-600 focus:outline-none 
                       focus:ring-2 focus:ring-white/20 transition-all duration-300 
                       rounded-2xl text-lg flex  justify-center gap-3 cursor-pointer'
                       onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <Image
                src={'/google.svg'}
                alt='Google'
                width={20}
                height={20}
                className='w-5 h-5'
              />
              Continue with Google
            </Button>
          </motion.div>
        </motion.div>
    </div>
  )
}

export default SocialMediaLogin
