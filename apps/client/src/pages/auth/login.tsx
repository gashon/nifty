import React from 'react';
import LoginForm from '@/features/auth/components/login-form';

export default function Login() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center px-5 py-20">
      <LoginForm />
    </div>
  );
}
