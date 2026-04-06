"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronLeftIcon, 
  CalendarIcon, 
  User,
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useRouter } from "next/navigation"

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
  AnimatedInputOTP,
  AnimatedInputOTPGroup,
  AnimatedInputOTPSlot,
} from "@/components/ui/otp-input"

export default function RegisterPage() {
  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const [otp, setOtp] = React.useState("")
  const [otpStatus, setOtpStatus] = React.useState<"idle" | "verifying" | "success" | "error">("idle")
  const router = useRouter()

  const handleProceed = () => {
    if (!email) return
    setIsLoading(true)
    // Simulate sending code
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
    }, 1500)
  }

  const handleVerifyOtp = (code: string) => {
    setOtpStatus("verifying")
    // Simulate validation flow
    setTimeout(() => {
      if (code === "123456") {
        setOtpStatus("success")
        setTimeout(() => {
          router.push("/dashboard") // Automatic proceed to account
        }, 1500)
      } else {
        setOtpStatus("error")
      }
    }, 1500)
  }

  return (
    <div className="relative md:h-screen md:overflow-hidden w-full bg-background transition-colors duration-500 selection:bg-black selection:text-white font-sans">
      <Particles
        color="#111118"
        quantity={180}
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
      <Button 
        variant="ghost" 
        className="absolute top-10 left-10 text-[#111118] hover:text-[#111118]/80 hover:bg-transparent text-lg transition-all group z-50" 
        asChild
      >
        <Link href="/">
          <ChevronLeftIcon className="me-3 size-5 group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>
      </Button>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        <div className="mx-auto space-y-10 sm:w-sm animate-in fade-in duration-1000">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <p className="text-[15px] text-[#2a2a2a] font-bold uppercase tracking-[0.2em] select-none cursor-default">Valle</p>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-sans text-7xl font-bold tracking-tight select-none cursor-default">
                Sign Up <span className="italic">or</span> <br /> Book Now.
              </h1>
              <p className="font-sans font-semibold text-muted-foreground text-[20px] leading-relaxed max-w-[280px] select-none cursor-default">
                Let the glamour unfold.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Drawer onOpenChange={(open) => { if (!open) setStep("email") }}>
              <DrawerTrigger render={
                <Button type="button" size="lg" className="w-full h-14 rounded-[12px] bg-[#d4d4d4] text-base font-semibold text-black border-border/40 hover:bg-[#d4d4d4]/90 hover:border-border transition-all duration-300 shadow-xl shadow-black/2 cursor-pointer">
                  <User className="me-2 size-6 text-black" />
                  Create your account now?
                </Button>
              }>
                {/* DRAWER CONTENT */}
                Create your account now?
              </DrawerTrigger>
              <DrawerPopup showBar position="bottom">
                <div className="flex flex-col items-center justify-center py-10 px-6 space-y-8 min-h-[400px]">
                  {step === "email" ? (
                    <div className="w-full max-w-xs space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="text-center space-y-3">
                        <DrawerTitle className="text-6xl font-sans font-bold tracking-tight select-none cursor-default">Sign Up</DrawerTitle>
                        <DrawerDescription className="text-[18px] font-sans text-muted-foreground select-none cursor-default"> 
                          Sign up with your Gmail address.
                        </DrawerDescription>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-[14px] font-semibold tracking-wide ml-1 -mt-2 mb-2 block">Gmail Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/40 pointer-events-none" />
                            <Input 
                              id="email"
                              type="email" 
                              spellCheck={false}
                              placeholder="your@gmail.com" 
                              className="h-12 rounded-[10px] bg-[#e0e0e0] border border-border/40 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent text-[17px] font-medium text-black shadow-none cursor-pointer pl-10"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handleProceed}
                          disabled={isLoading || !email}
                          className="w-full h-12 rounded-[10px] bg-[#2a2a2a] text-[16px] font-semibold text-white border-border/40 hover:bg-[#2a2a2a]/90 hover:border-border disabled:opacity-95 transition-all duration-300 shadow-xl shadow-black/2 cursor-pointer"
                        >
                          {isLoading ? "Sending Code..." : (
                            <span className="flex items-center justify-center gap-2 ">
                              Continue <ArrowRight className="size-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-xs space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center">
                      <div className="text-center space-y-3">
                        <DrawerTitle className="text-7xl font-sans font-bold tracking-tight whitespace-nowrap">Verify Code</DrawerTitle>
                        <DrawerDescription className="text-[16px] font-sans text-muted-foreground">
                          We&apos;ve sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                        </DrawerDescription>
                      </div>

                      <div className="flex flex-col items-center gap-4 w-full">
                        <AnimatedInputOTP 
                          maxLength={6} 
                          value={otp}
                          onChange={(val) => {
                            setOtp(val)
                            if (otpStatus === "error") setOtpStatus("idle")
                          }}
                          onComplete={handleVerifyOtp}
                          disabled={otpStatus === "verifying" || otpStatus === "success"}
                        >
                          <AnimatedInputOTPGroup>
                            <AnimatedInputOTPSlot index={0} className={otpStatus === "error" ? "border-red-500! bg-red-50! text-red-600!" : otpStatus === "success" ? "border-green-500! bg-green-50! text-green-600!" : ""} />
                            <AnimatedInputOTPSlot index={1} className={otpStatus === "error" ? "border-red-500! bg-red-50! text-red-600!" : otpStatus === "success" ? "border-green-500! bg-green-50! text-green-600!" : ""} />
                            <AnimatedInputOTPSlot index={2} className={otpStatus === "error" ? "border-red-500! bg-red-50! text-red-600!" : otpStatus === "success" ? "border-green-500! bg-green-50! text-green-600!" : ""} />
                          </AnimatedInputOTPGroup>
                          <div className="w-3 flex items-center justify-center text-muted-foreground text-sm">—</div>
                          <AnimatedInputOTPGroup>
                            <AnimatedInputOTPSlot index={3} className={otpStatus === "error" ? "border-red-500! bg-red-50! text-red-600!" : otpStatus === "success" ? "border-green-500! bg-green-50! text-green-600!" : ""} />
                            <AnimatedInputOTPSlot index={4} className={otpStatus === "error" ? "border-red-500! bg-red-50! text-red-600!" : otpStatus === "success" ? "border-green-500! bg-green-50! text-green-600!" : ""} />
                            <AnimatedInputOTPSlot index={5} className={otpStatus === "error" ? "border-red-500! bg-red-50! text-red-600!" : otpStatus === "success" ? "border-green-500! bg-green-50! text-green-600!" : ""} />
                          </AnimatedInputOTPGroup>
                        </AnimatedInputOTP>

                        <div className="h-6 flex items-center justify-center animate-in fade-in transition-all">
                          {otpStatus === "verifying" && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
                              <Loader2 className="size-4 animate-spin" /> Verifying code...
                            </div>
                          )}
                          {otpStatus === "error" && (
                            <div className="flex items-center gap-2 text-red-500 text-[18px] font-semibold tracking-tight whitespace-nowrap animate-in slide-in-from-bottom-1">
                              <XCircle className="size-6" /> Invalid verification code. Please try again.
                            </div>
                          )}
                          {otpStatus === "success" && (
                            <div className="flex items-center gap-2 text-green-600 text-[18px] font-semibold tracking-tight whitespace-nowrap animate-in slide-in-from-bottom-1">
                              <CheckCircle2 className="size-4" /> Code verified successfully!
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center space-y-3 w-full">
                        <p className="text-[15px] text-muted-foreground">
                          Didn&apos;t receive a code? <button className="text-[15px] text-[#2a2a2a] hover:underline font-semibold">Resend Code</button>
                        </p>
                        <DrawerClose render={<Button variant="ghost" className="text-[15px] text-muted-foreground hover:text-foreground" />}>
                          Cancel
                        </DrawerClose>
                      </div>
                    </div>
                  )}
                </div>
              </DrawerPopup>
            </Drawer>

            <Button type="button" size="lg" className="w-full h-14 rounded-[12px] text-base font-semibold bg-[#2a2a2a] text-white hover:bg-[#2a2a2a]/90 transition-all duration-300 shadow-xl shadow-black/10" asChild>
              <Link href="/book">
                <CalendarIcon className="me-2 size-5" />
                Book as guest
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
