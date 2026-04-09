// ADMIN LOGIN PAGE
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Crown } from "lucide-react";
import { Skeleton } from "boneyard-js/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPageLoading, setIsPageLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // If we're snapshotting with boneyard-js, show content immediately
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("snapshot=true")
    ) {
      setIsPageLoading(false);
      return;
    }
    const timer = setTimeout(() => setIsPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
            <Link href="/owner-login">
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
          {!mounted ? (
            <div className="space-y-10">
              <div className="h-20 bg-gray-100/10 rounded animate-pulse" />
              <div className="h-64 bg-gray-100/10 rounded animate-pulse" />
            </div>
          ) : (
            <Skeleton name="admin-login-form" loading={isPageLoading}>
              {/* Header Texts */}
              <div className="space-y-1 select-none cursor-default">
                <h1 className="text-[clamp(1.875rem,4vw,2.25rem)] font-sans font-bold tracking-tight text-[#2c1d14]">
                  Admin Access
                </h1>
                <p className="text-[#1c120c]/60 text-[1rem] mb-4">
                  Log in to the Valle Studio management system to continue.
                </p>
              </div>

              <form onSubmit={handleProceed} className="space-y-5">
                {/* Role Switcher Tabs */}
                <div className="flex justify-center mb-6">
                  <Tabs
                    defaultValue="admin"
                    className="w-full"
                    onValueChange={(val) => {
                      if (val === "owner") router.push("/owner-login");
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-2 p-1.5 bg-[#aea8a4] rounded-[5px]">
                      <TabsTrigger
                        value="admin"
                        className="rounded-[5px] py-2.5 transition-all outline-hidden data-[state=active]:bg-[#494136] data-[state=active]:text-[#fafafa] data-[state=active]:shadow-none"
                      >
                        Admin
                      </TabsTrigger>
                      <TabsTrigger
                        value="owner"
                        className="rounded-[5px] py-2.5 transition-all outline-hidden data-[state=active]:bg-[#494136] data-[state=active]:text-[#fafafa] data-[state=active]:shadow-none"
                      >
                        Owner
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

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
            </Skeleton>
          )}
        </div>
      </div>
    </div>
  );
}
