// CUSTOMER LOGIN PAGE
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred during Google Sign-In");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex font-sans">
      {/* LEFT PANEL*/}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white overflow-hidden">
        {/* Dark Brown Gradient decorative overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-[#2c1b12]/40" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2c1b12]/30 rounded-full blur-3xl opacity-50" />

        {/* Arrow and Home Text*/}
        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 transition-all font-medium text-[0.875rem] group hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        {/* Brand Content Container */}
        <div className="relative z-10 w-full flex flex-col justify-between p-16 h-screen">
          <div className="flex-1 flex items-center justify-center">
            <Link href="/login/admin">
              <Image
                src="/img/vs-logo.png"
                alt="Valle Studio Logo"
                width={450}
                height={450}
                className="drop-shadow-2xl"
                priority
              />
            </Link>
          </div>

          {/* Text Block - Pushed to Bottom Left */}
          <div className="space-y-2 cursor-default">
            <h2 className="text-[clamp(2.5rem,5vw,3rem)] font-sans font-bold text-transparent bg-clip-text bg-linear-to-br from-[#1c120c] to-[#3a261b] tracking-tight leading-tight">
              Where beauty meets <i className="italic">magic.</i>
            </h2>
            <p className="text-[#1c120c]/60 text-[1rem] font-medium leading-relaxed max-w-[560px]">
              We believe beauty is personal. That&apos;s why every service at
              Valle Studio is personalized to bring out your unique style and
              confidence.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center px-8 sm:px-16 md:px-24 bg-white">
        {/* Social Icons Bar (Horizontal) */}
        <div className="absolute top-11 right-12 z-20 hidden lg:flex flex-row gap-5 items-center">
          <Link
            href="https://www.facebook.com/vallestudiosalon"
            target="_blank"
            className="text-[#46403c] hover:opacity-85 transition-opacity"
            title="Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
          <Link
            href="https://www.instagram.com/vallestudio_"
            target="_blank"
            className="text-[#46403c] hover:opacity-85 transition-opacity"
            title="Instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </Link>
          <Link
            href="https://www.tiktok.com/@valle.studio"
            target="_blank"
            className="text-[#46403c] hover:opacity-85 transition-opacity"
            title="TikTok"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.023l-.022.002c-.21.006-.411.021-.613.043v14.992c0 2.029-1.645 3.674-3.674 3.674-2.029 0-3.674-1.645-3.674-3.674s1.645-3.674 3.674-3.674c.231 0 .452.022.666.063V8.04c-.218-.016-.438-.026-.66-.026-4.017 0-7.272 3.255-7.272 7.272s3.255 7.272 7.272 7.272 7.272-3.255 7.272-7.272V6.157c2.193 1.547 4.861 2.454 7.74 2.454V5.204c-3.153 0-5.836-1.801-7.141-4.426l-.056-.112-.008-.013c-.11-.2-.204-.405-.286-.615l-.013-.03-.004-.01-l-.001-.002l-.001-.003z" />
            </svg>
          </Link>
        </div>

        {/* Mobile Back Button */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 transition-all font-medium text-[0.875rem] group hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        <div className="w-full max-w-[420px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-0 duration-1000">
          {/* Header Texts */}
          <div className="space-y-1 select-none cursor-default">
            <h1 className="text-[clamp(1.875rem,4vw,2.25rem)] font-sans font-bold tracking-tight text-[#2c1d14]">
              Welcome Back
            </h1>
            <p className="text-[#1c120c]/60 text-[1rem] mb-4">
              Log in to your Valle Studio account to continue.
            </p>
          </div>

          <form onSubmit={handleProceed} className="space-y-5">
            <div className="flex flex-col">
              <Label
                htmlFor="email"
                className="text-[0.875rem] font-bold text-[#2c1d14] mb-2 block"
              >
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#1c120c]/60 group-focus-within:text-[#1c120c]/60 transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@gmail.com"
                  className="h-10 pl-10 rounded-[5px] bg-[#fafafa] focus-visible:ring-1 focus-visible:border-[#f4f4f4] transition-all text-gray-800 shadow-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-5">
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="password"
                  className="text-[0.875rem] font-bold text-[#2c1d14]"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[0.8125rem] font-semibold text-[#2c1d14]/70 hover:text-[#2c1d14] transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#1c120c]/60 group-focus-within:text-[#1c120c]/60 transition-colors" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-10 pl-10 pr-10 rounded-[5px] bg-[#fafafa] focus-visible:ring-1 focus-visible:border-[#f4f4f4] transition-all text-gray-800 shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2c1d14]/60 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-[5px] bg-[#494136] hover:bg-black text-white/95 font-semibold text-[1rem] transition-all shadow-md mt-2 cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center -mt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#1c120c]/15" />
            </div>
            <span className="relative bg-white px-4 text-[0.6875rem] font-bold tracking-[0.05em] text-[#1c120c]/50 select-none">
              or
            </span>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3 -mt-4">
            <Button
              variant="outline"
              className="w-full h-10 bg-[#dddddd] hover:bg-[#d0d0d0] border-transparent text-[#2c1d14] font-semibold flex items-center justify-center gap-3 rounded-[5px] transition-all shadow-xs cursor-pointer"
              onClick={handleGoogleSignIn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign In with Google</span>
            </Button>
          </div>

          <div className="space-y-4 -mt-5">
            <p className="text-center text-[0.870rem] font-sm text-[#1c120c]/60 select-none cursor-default">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-bold text-[#2c1d14] underline hover:text-[#494136] transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
