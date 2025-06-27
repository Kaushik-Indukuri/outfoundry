'use client'

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
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
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block m-4 rounded-xl overflow-hidden">
        <img
          src="/outfoundry-login.png"
          alt="Image"
          className="h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
