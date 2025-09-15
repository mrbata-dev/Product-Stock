'use client'
import { AnimatePresence, easeInOut, motion } from "motion/react"
import React, { useEffect, useState } from 'react';
import { Button } from '../../button'; 

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import SocialMediaLogin from "./SocialMediaLogin";

const LoginUi = ({ mode }: { mode: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [formData, setFormData] = useState(mode === 'login' ? 
  { email: '', password: '' } : 
  { uname: '', email: '', password: '', confirmPassword: '' }
);
  const[errors, setErrors] = useState('');
  const[isLoading, setIsLoading] = useState(false);
  // const searchParams = useSearchParams();
  const router = useRouter();

  // form handaling
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault();
    console.log(formData);
    
    setErrors(' ');
    setIsLoading(true);
    try {
      if (mode ===  'login')
      {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
          callbackUrl: '/dashboard'
        });

        if (result?.error) {
          setErrors(result.error);
        } else {
          router.push('/dashboard');
        }
      }

      if (mode === "signup") {
          if (formData.password !== formData.confirmPassword) {
  setErrors("Passwords do not match");
  setIsLoading(false);
  return;
}
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uname: formData.uname,
      email: formData.email,
      password: formData.password,
    }),
  });



  if (!res.ok) {
    const data = await res.json();
    setErrors(data.error || "Signup failed");
  } else {
    // auto-login after signup
    await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl: "/dashboard",
    });
    router.push("/dashboard");
  }
}
    } catch (error) {
      setErrors('An unexpected Error!')
      console.log(error);
      
      
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setErrors('');
  }, [formData]);

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginTop: '2rem',
      transition: { 
        duration: 0.4, 
        ease: easeInOut
      }
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      transition: { 
        duration: 0.3, 
        ease: easeInOut
      }
    }
  };

  return (
    <div className='text-white w-full max-w-lg mx-auto py-8'>
      <div  className='flex items-center justify-center flex-col' >
        <motion.form
          className='w-full space-y-8'
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className='text-center space-y-3'>
            <h1 className='text-4xl font-bold tracking-tight'>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className='text-gray-400 text-lg'>
              {mode === 'login' 
                ? 'Sign in to continue to your account' 
                : 'Fill in your details to get started'
              }
            </p>
          </motion.div>
{errors && (
          <div className="bg-red-500 text-white p-3 rounded-md mt-4 w-full text-center">
            {errors}
          </div>
        )}
          {/* Username field for signup */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className='space-y-3'
              >
                <label htmlFor="uname" className='block text-sm font-medium text-gray-300'>
                  Full Name
                </label>
                <div className='relative'>
                  <input
                  value={formData.uname}
                       onChange={handleChange}
                    type="text"
                    name="uname"
                    id="uname"
                    autoComplete="name"
                    required
                    aria-label="Full Name"
                    placeholder='John Doe'
                    className='w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl 
                             text-black placeholder-gray-500 outline-none
                             focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-gray-900/70
                             transition-all duration-300 ease-out
                             hover:border-gray-600'
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email field */}
          <motion.div variants={itemVariants} className='space-y-3'>
            <label htmlFor="email" className='block text-sm font-medium text-gray-300'>
              Email Address
            </label>
            <div className='relative'>
              <input
                type="email"
                name="email"
                id="email"
                 value={formData.email}
                onChange={handleChange}
                aria-label="Email Address"
                required
                autoComplete="email"
                placeholder='john@example.com'
                className='w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl 
                         text-black placeholder-gray-500 outline-none
                         focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-gray-900/70
                         transition-all duration-300 ease-out
                         hover:border-gray-600'
              />
            </div>
          </motion.div>

          {/* Password field */}
          <motion.div variants={itemVariants} className='space-y-3'>
            <label htmlFor="password" className='block text-sm font-medium text-gray-300'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                aria-label="Password"
                required
                 value={formData.password}
                onChange={handleChange}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder='••••••••'
                className='w-full px-4 py-4 pr-12 bg-gray-900/50 border border-gray-700 rounded-2xl 
                         text-black placeholder-gray-500 outline-none
                         focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-gray-900/70
                         transition-all duration-300 ease-out
                         hover:border-gray-600'
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white
                         transition-colors duration-200'
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password field for signup */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
               
                className='space-y-3'
              >
                <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-300'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                     value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder='••••••••'
                    className='w-full px-4 py-4 pr-12 bg-gray-900/50 border border-gray-700 rounded-2xl 
                             text-black placeholder-gray-500 outline-none
                             focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-gray-900/70
                             transition-all duration-300 ease-out
                             hover:border-gray-600'
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white
                             transition-colors duration-200'
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot Password Link for Login */}
          {mode === 'login' && (
            <motion.div variants={itemVariants} className='text-right'>
              <Link href="/auth/forgot-password" 
                    className='text-sm text-gray-400 hover:text-white transition-colors duration-200'>
                Forgot password?
              </Link>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                type="submit"
                variant={'default'}
                className='w-full py-4 px-8 bg-white text-black font-semibold rounded-2xl
                         hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50
                         transition-all duration-300 ease-out text-lg
                         shadow-lg hover:shadow-xl cursor-pointer'
                disabled={isLoading}
              >
               {
                isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></span>
                    <span>Loading...</span>
                  </div>
                ) : (
                   mode === 'login' ? 'Sign In' : 'Create Account'
                )
                
               }
              </Button>
            </motion.div>
          </motion.div>

          {/* Switch Mode Link */}
          <motion.div variants={itemVariants} className='text-center'>
            {mode === 'login' ? (
              <Link href={'/auth/signup'} 
                    className='text-gray-400 hover:text-white transition-colors duration-200'>
                Don&apos;t have an account? 
                <span className='font-semibold ml-1'>Sign up</span>
              </Link>
            ) : (
              <Link href={'/auth/login'} 
                    className='text-gray-400 hover:text-white transition-colors duration-200'>
                Already have an account? 
                <span className='font-semibold ml-1'>Sign in</span>
              </Link>
            )}
          </motion.div>
        </motion.form>

        {/* Divider */}
        <motion.div
          className='w-full flex items-center justify-center gap-4 my-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
        >
          <div className='h-px bg-gray-700 flex-1'></div>
          <span className='text-gray-500 text-sm px-4'>or continue with</span>
          <div className='h-px bg-gray-700 flex-1'></div>
        </motion.div>

        {/* Social Login */}
       <SocialMediaLogin/>

        {/* Terms and Privacy */}
        {mode === 'signup' && (
          <motion.div
            className='mt-6 text-center text-xs text-gray-500 leading-relaxed'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8 } }}
          >
            By creating an account, you agree to our{' '}
            <Link href="/terms" className='text-gray-300 hover:text-white transition-colors'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className='text-gray-300 hover:text-white transition-colors'>
              Privacy Policy
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoginUi;