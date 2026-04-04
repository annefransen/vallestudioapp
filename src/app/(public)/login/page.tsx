"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Scissors, Loader2, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
type FormData = z.infer<typeof schema>

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Welcome back!")
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-black selection:text-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed -bottom-64 -left-64 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-64 -right-64 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex flex-col items-center group mb-8">
              <div className="w-14 h-14 rounded-2xl border border-border/40 bg-white shadow-sm flex items-center justify-center transition-all duration-500 group-hover:border-foreground/20 group-hover:shadow-md">
                <Scissors className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <span className="mt-4 text-[11px] font-bold tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                Valle Studio
              </span>
            </Link>
            <h1 className="text-5xl font-serif font-medium tracking-tight mb-3">
              Welcome <span className="italic">back</span>.
            </h1>
            <p className="text-muted-foreground/70 leading-relaxed max-w-[300px] mx-auto text-sm">
              Sign in to manage your bookings and view your hair journey.
            </p>
          </div>

          <Card className="border-border/40 bg-white/40 backdrop-blur-md shadow-2xl shadow-black/[0.03] rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-border/60">
            <CardContent className="p-8 sm:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80 pl-1">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className={cn(
                      "h-14 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 transition-all duration-300",
                      errors.email && "border-destructive/30 focus:border-destructive/30"
                    )}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-semibold text-destructive/80 pl-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1 pr-1">
                    <Label htmlFor="password" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80">
                      Password
                    </Label>
                    <Link href="/forgot-password" size="sm" className="text-[11px] font-bold tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...register("password")}
                      className={cn(
                        "h-14 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 pr-12 transition-all duration-300",
                        errors.password && "border-destructive/30 focus:border-destructive/30"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] font-semibold text-destructive/80 pl-1">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl text-base font-medium shadow-xl shadow-foreground/5 transition-all duration-500 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t border-border/10 flex flex-col items-center gap-6">
                <Link href="/book" className="text-[11px] font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                   Continue as Guest
                </Link>
                <p className="text-sm text-muted-foreground/60">
                  New to Valle?{" "}
                  <Link href="/register" className="text-foreground font-semibold hover:underline">
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
