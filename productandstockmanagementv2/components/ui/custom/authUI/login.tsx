'use client'
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useState } from 'react';
import { Button } from '../../button'; 
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import SocialMediaLogin from "./SocialMediaLogin";

// Types for better type safety
interface FormData {
  uname?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface FormErrors {
  uname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// Error messages mapping
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  USER_NOT_FOUND: "No account found with this email address.",
  ACCOUNT_INACTIVE: "Your account has been deactivated. Please contact support.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  RATE_LIMIT: "Too many attempts. Please try again in a few minutes.",
} as const;

// Validation functions
const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain a lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain an uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
  return null;
};

const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name can only contain letters, spaces, hyphens and apostrophes";
  return null;
};

const LoginUi = ({ mode }: { mode: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    mode === 'login' 
      ? { email: '', password: '' } 
      : { uname: '', email: '', password: '', confirmPassword: '' }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Real-time validation
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return mode === 'signup' ? validatePassword(value) : null;
      case 'uname':
        return mode === 'signup' ? validateName(value) : null;
      case 'confirmPassword':
        return value !== formData.password ? "Passwords don't match" : null;
      default:
        return null;
    }
  };

  // Handle input change with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Real-time validation for touched fields
    if (value) {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (mode === 'signup' && formData.uname !== undefined) {
      const nameError = validateName(formData.uname);
      if (nameError) newErrors.uname = nameError;
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (mode === 'signup') {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }
    
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        });

        if (result?.error) {
          // Map NextAuth errors to user-friendly messages
          let errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
          
          if (result.error.includes('rate limit')) {
            errorMessage = ERROR_MESSAGES.RATE_LIMIT;
          } else if (result.error.includes('inactive')) {
            errorMessage = ERROR_MESSAGES.ACCOUNT_INACTIVE;
          }
          
          setErrors({ general: errorMessage });
        } else if (result?.ok) {
          setSuccessMessage('Login successful! Redirecting...');
          setTimeout(() => router.push('/dashboard'), 1000);
        }
      } else {
        // Signup logic
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uname: formData.uname,
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Handle specific error codes
          if (res.status === 409) {
            setErrors({ email: "An account with this email already exists" });
          } else if (res.status === 400) {
            setErrors({ general: data.error || ERROR_MESSAGES.VALIDATION_ERROR });
          } else {
            setErrors({ general: data.error || ERROR_MESSAGES.SERVER_ERROR });
          }
        } else {
          setSuccessMessage('Account created! Signing you in...');
          
          // Auto-login after signup
          const loginResult = await signIn("credentials", {
            redirect: false,
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
          });
          
          if (loginResult?.ok) {
            setTimeout(() => router.push("/dashboard"), 1000);
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ 
        general: error instanceof Error && error.message.includes('Network') 
          ? ERROR_MESSAGES.NETWORK_ERROR 
          : ERROR_MESSAGES.SERVER_ERROR 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear general errors when form data changes
  useEffect(() => {
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
    setSuccessMessage('');
  }, [formData]);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div className='w-full mx-auto py-8 px-4'>
      <motion.form
        className='relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100'
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-black mb-2'>
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className='text-gray-600 text-sm'>
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Create your account in just a few steps'
            }
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence mode="wait">
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center text-sm font-medium"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* General Error Message */}
        <AnimatePresence mode="wait">
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm"
            >
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.general}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Name field for signup */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <label htmlFor="uname" className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  value={formData.uname || ''}
                  onChange={handleChange}
                  type="text"
                  name="uname"
                  id="uname"
                  autoComplete="name"
                  placeholder='John Doe'
                  className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-black placeholder-gray-400
                           focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                           ${errors.uname ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                />
                {errors.uname && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-600 mt-1 ml-1"
                  >
                    {errors.uname}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder='john@example.com'
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-black placeholder-gray-400
                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                       ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-600 mt-1 ml-1"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder='••••••••'
                className={`w-full px-4 py-3 pr-12 bg-white border-2 rounded-lg text-black placeholder-gray-400
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                         ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600
                         transition-colors duration-200'
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-600 mt-1 ml-1"
              >
                {errors.password}
              </motion.p>
            )}
            {mode === 'signup' && formData.password && !errors.password && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 space-y-1"
              >
                <p className="text-xs text-gray-600">Password strength:</p>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        formData.password.length > i * 4 
                          ? i < 2 ? 'bg-red-400' : i < 3 ? 'bg-yellow-400' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password field for signup */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder='••••••••'
                    className={`w-full px-4 py-3 pr-12 bg-white border-2 rounded-lg text-black placeholder-gray-400
                             focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200
                             ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600
                             transition-colors duration-200'
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-600 mt-1 ml-1"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-green-600 mt-1 ml-1 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Passwords match
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Forgot Password Link */}
        {mode === 'login' && (
          <motion.div variants={itemVariants} className='text-right mt-4'>
            <Link 
              href="/auth/forgot-password" 
              className='text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline'
            >
              Forgot password?
            </Link>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <Button
            type="submit"
            variant='default'
            disabled={isLoading}
            className={`w-full py-3.5 px-6 font-semibold rounded-lg transition-all duration-200 text-white
                     ${isLoading 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg hover:shadow-xl'
                     } focus:outline-none focus:ring-4 focus:ring-blue-200`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center gap-2'>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </motion.div>

        {/* Alternative Action Button */}
        <motion.div variants={itemVariants} className="mt-3">
          <Button
            type="button"
            variant='outline'
            onClick={() => router.push(mode === 'login' ? '/auth/signup' : '/auth/login')}
            className='w-full py-3.5 px-6 font-semibold rounded-lg transition-all duration-200
                     bg-white text-green-600 border-2 border-green-600 hover:bg-green-50
                     focus:outline-none focus:ring-4 focus:ring-green-200'
          >
            {mode === 'login' ? 'Create New Account' : 'Back to Sign In'}
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div
          className='flex items-center gap-3 my-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4 } }}
        >
          <div className='h-px bg-gray-200 flex-1'></div>
          <span className='text-xs text-gray-500 uppercase tracking-wider font-medium'>or continue with</span>
          <div className='h-px bg-gray-200 flex-1'></div>
        </motion.div>

        {/* Social Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          <SocialMediaLogin />
        </motion.div>

        {/* Terms and Privacy */}
        {mode === 'signup' && (
          <motion.div
            className='mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6 } }}
          >
            By signing up, you agree to our{' '}
            <Link href="/terms" className='text-blue-600 hover:text-blue-700 hover:underline'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className='text-blue-600 hover:text-blue-700 hover:underline'>
              Privacy Policy
            </Link>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};

export default LoginUi;