import React from 'react'
import { SignUpForm } from '@/components/sign-up-form'
import { AnimatedHeader } from '@/components/animatedHeader'

export const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-6 px-6 md:px-10">
      <div className = "mb-6">
        <AnimatedHeader/>
        </div>
        <SignUpForm />
      </div>
  )
}
