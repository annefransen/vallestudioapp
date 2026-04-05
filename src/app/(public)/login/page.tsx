"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronLeftIcon, 
  User 
} from "lucide-react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/components/ui/button"
import { Particles } from "@/components/ui/particles"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/interfaces-input-otp"

export default function LoginPage() {
  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleProceed = () => {
    if (!email) return
    setIsLoading(true)
    // Simulate sending code
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
    }, 1500)
  }

  return (
    <div className="relative md:h-screen md:overflow-hidden w-full bg-background transition-colors duration-500 selection:bg-black selection:text-white font-sans">
      <Particles
        color="#2a2a2a"
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



      {/* Navigation Home */}
      <Button variant="ghost" className="absolute top-8 left-8 text-muted-foreground/60 hover:text-foreground transition-all group z-50" asChild>
        <Link href="/">
          <ChevronLeftIcon className="me-2 size-4 group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>
      </Button>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        {/* Auth Gateway Content */}
        <div className="mx-auto space-y-10 sm:w-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Valle</p>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-sans text-6xl font-bold tracking-tight">
                Sign In.
              </h1>
              <p className="text-muted-foreground/70 text-md leading-relaxed max-w-[280px]">
                Welcome back to Valle Studio. <br /> Continue to your account.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Drawer onOpenChange={(open) => { if (!open) setStep("email") }}>
              <DrawerTrigger render={
                <Button type="button" size="lg" className="w-full h-14 rounded-2 bg-[#d4d4d4] text-black border border-border/40 hover:bg-[#d4d4d4] hover:border-border transition-all duration-300 shadow-xl shadow-black/2">
                  <User className="me-3 size-5 text-black" />
                  Sign In with Account.
                </Button>
              }>
                Sign In with Account.
              </DrawerTrigger>
              <DrawerPopup showBar position="bottom">
                <div className="flex flex-col items-center justify-center py-10 px-6 space-y-8 min-h-[400px]">
                  {step === "email" ? (
                    <div className="w-full max-w-xs space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="text-center space-y-2">
                        <DrawerTitle className="text-3xl font-bold tracking-tight">Sign In</DrawerTitle>
                        <DrawerDescription className="text-muted-foreground">
                          Enter your email to access your account.
                        </DrawerDescription>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Email Address</Label>
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="yourname@gmail.com" 
                            className="h-12 rounded-xl bg-muted/30 border-border/40 focus:ring-1 focus:ring-primary/20 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleProceed}
                          disabled={isLoading || !email}
                          className="w-full h-12 rounded-xl bg-black text-white hover:bg-black/90 transition-all shadow-lg shadow-black/10"
                        >
                          {isLoading ? "Signing In..." : "Proceed"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-xs space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
                      <div className="text-center space-y-2">
                        <DrawerTitle className="text-3xl font-bold tracking-tight">Verify Code</DrawerTitle>
                        <DrawerDescription className="text-muted-foreground">
                          We&apos;ve sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                        </DrawerDescription>
                      </div>

                      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>

                      <div className="text-center space-y-4 w-full">
                        <p className="text-xs text-muted-foreground">
                          Didn&apos;t receive a code? <button className="text-primary hover:underline font-medium">Resend</button>
                        </p>
                        <DrawerClose render={<Button variant="ghost" className="text-muted-foreground hover:text-foreground" />}>
                          Cancel
                        </DrawerClose>
                      </div>
                    </div>
                  )}
                </div>
              </DrawerPopup>
            </Drawer>

            <p className="text-center text-xs text-muted-foreground/60">
              Don&apos;t have an account? <Link href="/register" className="text-foreground hover:underline font-medium">Create your account.</Link>
            </p>
          </div>

          <div className="pt-8 border-t border-border/10">
            <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              By signing in, you agree to our{' '}
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
