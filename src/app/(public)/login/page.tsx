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
    <div className="min-h-screen w-full bg-white dark:bg-[#111118] flex font-sans">
      
      {/* Left Panel (Image) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#f8f9fa] dark:bg-[#16161e]">
        <Image 
          src="/login-img.png" 
          alt="Valle Studio" 
          fill 
          className="object-cover object-center"
          priority
        />
        
        {/* Upper left side arrow and home text */}
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 shadow-lg text-gray-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-black transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 md:px-24">
        
        {/* Mobile Back Button */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#16161e] border border-gray-200 dark:border-white/10 shadow-md text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-black transition-all">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
        
        <div className="w-full max-w-[400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome Back to Valle Studio</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
              Enter your account to login.
            </p>
          </div>

          <form onSubmit={handleProceed} className="space-y-6 pt-2">
            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gmail Address</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-300 transition-colors" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@gmail.com" 
                  className="h-14 pl-11 rounded-xl bg-white dark:bg-[#16161e] border border-gray-200 dark:border-white/10 focus-visible:ring-1 focus-visible:ring-gray-900 dark:focus-visible:ring-white/20 focus-visible:border-gray-900 dark:focus-visible:border-white/20 transition-all font-medium text-gray-900 dark:text-white shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-300 transition-colors" />
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="h-14 pl-11 pr-11 rounded-xl bg-white dark:bg-[#16161e] border border-gray-200 dark:border-white/10 focus-visible:ring-1 focus-visible:ring-gray-900 dark:focus-visible:ring-white/20 focus-visible:border-gray-900 dark:focus-visible:border-white/20 transition-all font-medium text-gray-900 dark:text-white shadow-sm"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-[#2a2a2a] hover:bg-[#2a2a2a]/90 text-white font-semibold text-base transition-all shadow-xl shadow-black/10 mt-2"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 pt-4">
            New here? <Link href="/register" className="font-bold text-gray-900 dark:text-white hover:underline transition-all">Create an account.</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
