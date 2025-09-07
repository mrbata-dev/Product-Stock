import LoginUi from '@/components/ui/custom/authUI/login';
import React from 'react'

const LoginPage = () => {
  const mode = 'login';
  return (
    <div >
      <LoginUi mode = {mode}/>
    </div>
  )
}

export default LoginPage
