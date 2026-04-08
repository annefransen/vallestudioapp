// LOGIN PAGE
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Mail,
  Lock,
  Eye, 
  EyeOff
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full bg-white flex font-sans">
      
      {/* LEFT PANEL*/}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-12 overflow-hidden">
        {/* Dark Brown Gradient decorative overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-[#2c1b12]/40" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2c1b12]/30 rounded-full blur-3xl" />
        
        {/* Arrow and Home Text*/}
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 transition-all font-medium text-[0.875rem] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        {/* Brand Content */}
        <div className="relative z-10 text-center space-y-4 max-w-lg">
          <Image 
            src="/img/vs-logo.png" 
            alt="Valle Studio Logo" 
            width={450} 
            height={450} 
            className="mx-auto drop-shadow-md pb-2"
          />
            <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-sans font-bold text-transparent bg-clip-text bg-linear-to-br from-[#1c120c] to-[#3a261b] tracking-tight">
            Valle Studio
          </h2>
          <p className="text-black text-[1rem] md:text-[1.125rem] font-medium leading-relaxed max-w-sm mx-auto">
            Book your next appointment seamlessly.
          </p>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center px-8 sm:px-16 md:px-24 bg-white">
        
        {/* Mobile Back Button */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all text-gray-700 font-medium text-[0.875rem] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>
        
        <div className="w-full max-w-[420px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Texts */}
          <div className="space-y-2.5">
            <h1 className="text-[clamp(1.875rem,4vw,2.25rem)] font-sans font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-[0.9375rem]">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleProceed} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[0.875rem] font-semibold text-gray-700">Email Address</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@email.com" 
                  className="h-12 pl-11 rounded-lg bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all text-gray-900 shadow-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[0.875rem] font-semibold text-gray-700">Password</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="h-12 pl-11 pr-11 rounded-lg bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all text-gray-900 shadow-xs"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold text-[0.9375rem] transition-all shadow-md mt-4"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-[0.9375rem] font-medium text-gray-600">
            Don&apos;t have an account yet? <Link href="/register" className="font-bold text-gray-900 hover:text-black hover:underline transition-all">Create Account.</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
