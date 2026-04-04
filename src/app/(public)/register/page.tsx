// REGISTRATION PAGE

"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, Grid2x2PlusIcon } from "lucide-react"
import Link from "next/link"
import { Particles } from "@/components/ui/particles"

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
)

const GithubIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-60.86 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

export default function RegisterPage() {
  return (
    <div className="relative md:h-screen md:overflow-hidden w-full bg-background transition-colors duration-500 selection:bg-black selection:text-white">
      <Particles
        color="#666666"
        quantity={120}
        ease={20}
        className="absolute inset-0"
      />
      
      {/* Visual Background Accents */}
      <div
        aria-hidden
        className="absolute inset-0 isolate -z-10 contain-strict opacity-25"
      >
        <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,var(--color-foreground,var(--color-foreground))_0,hsla(0,0%,55%,.02)_50%,var(--color-foreground,var(--color-foreground))_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full blur-[80px]" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-foreground,var(--color-foreground))_0,var(--color-foreground,var(--color-foreground))_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full blur-[60px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        {/* Navigation Home */}
        <Button variant="ghost" className="absolute top-6 left-6 text-muted-foreground/60 hover:text-foreground transition-all group" asChild>
          <Link href="/">
            <ChevronLeftIcon className="me-2 size-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </Button>

        {/* Auth Gateway Content */}
        <div className="mx-auto space-y-10 sm:w-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                <Grid2x2PlusIcon className="size-5" />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-40">Valle</p>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-heading text-4xl font-medium tracking-tight">
                Sign In <span className="italic font-serif">or</span> Join Now.
              </h1>
              <p className="text-muted-foreground/70 text-sm leading-relaxed max-w-[280px]">
                Enter the premium studio. Manage your bookings and explore your style.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="button" size="lg" className="w-full h-14 rounded-2xl bg-white text-black border border-border/40 hover:bg-muted/30 hover:border-border transition-all duration-300 shadow-xl shadow-black/2">
              <GoogleIcon className="me-3 size-4" />
              Continue with Google
            </Button>
            <Button type="button" size="lg" className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 transition-all duration-300 shadow-xl shadow-black/10">
              <GithubIcon className="me-3 size-4" />
              Continue with GitHub
            </Button>
          </div>

          <div className="pt-8 border-t border-border/10">
            <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              By clicking continue, you agree to our{' '}
              <a href="#" className="text-foreground/60 hover:text-foreground underline underline-offset-4 decoration-border transition-colors">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-foreground/60 hover:text-foreground underline underline-offset-4 decoration-border transition-colors">Privacy</a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
