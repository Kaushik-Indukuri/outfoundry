'use client'

import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center -mt-11">
      <div className="flex w-full max-w-sm flex-col">
        <SignupForm />
      </div>
    </div>
  )
} 