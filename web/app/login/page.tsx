'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center -mt-16">
      <div className="flex w-full max-w-sm flex-col">
        <LoginForm />
      </div>
    </div>
  )
}