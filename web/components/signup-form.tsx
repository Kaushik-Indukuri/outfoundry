'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Note: Supabase requires email confirmation by default
      // You might want to redirect to a confirmation page
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground text-sm text-balance">
            We've sent you a confirmation link to verify your email address.
          </p>
        </div>
        <div className="text-center">
          <a href="/login" className="text-primary hover:underline">
            Back to sign in
          </a>
        </div>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-destructive text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="Your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" type="button" disabled>
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white mx-1 h-4 w-4 shrink-0">
            <g clipPath="url(#clip0_1276_2)">
              <path d="M16 8.19187C16 7.65157 15.9467 7.09385 15.8577 6.57099H8.15782V9.65589H12.5679C12.3901 10.6493 11.8033 11.5208 10.9319 12.0785L13.5638 14.0828C15.1109 12.6711 16 10.6145 16 8.19187Z" fill="#4280EF"></path>
              <path d="M8.15782 16C10.3629 16 12.2123 15.2854 13.5638 14.0654L10.9319 12.0785C10.2028 12.5665 9.26035 12.8454 8.15782 12.8454C6.0239 12.8454 4.22784 11.4336 3.56988 9.55132L0.866907 11.5905C2.25396 14.292 5.06363 16 8.15782 16Z" fill="#34A353"></path>
              <path d="M3.56988 9.53389C3.23201 8.54045 3.23201 7.45986 3.56988 6.46641L0.866907 4.40981C-0.288969 6.67556 -0.288969 9.34217 0.866907 11.5905L3.56988 9.53389Z" fill="#F6B704"></path>
              <path d="M8.15782 3.17236C9.3137 3.15493 10.4518 3.59065 11.2876 4.37495L13.6171 2.07434C12.1412 0.714887 10.1851 -0.0171247 8.15782 0.000304184C5.06363 0.000304184 2.25396 1.70833 0.866907 4.40981L3.56988 6.46641C4.22784 4.56667 6.0239 3.17236 8.15782 3.17236Z" fill="#E54335"></path>
            </g>
            <defs>
              <clipPath id="clip0_1276_2">
                <rect width="16" height="16" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  )
} 