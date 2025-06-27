'use client'

import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/outfoundry.svg"
              alt="Outfoundry"
              width={140}
              height={20}
              className="h-6 w-auto"
            />
          </Link>
        </div>
        <SignupForm />
      </div>
    </div>
  )
} 