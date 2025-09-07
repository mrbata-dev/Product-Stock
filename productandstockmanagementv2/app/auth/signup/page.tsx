import LoginUi from '@/components/ui/custom/authUI/login';
import React from 'react'

const SignUpPage = () => {
    const mode = 'signup';
  return (
    <div>
      <LoginUi mode = {mode}/>
    </div>
  )
}

export default SignUpPage
