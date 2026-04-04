"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
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
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^(\+63|0)\d{10}$/, "Enter a valid Philippine phone number"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})
type FormData = z.infer<typeof schema>

function RegisterContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone,
        },
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Account created! Welcome to Valle Studio.")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-black selection:text-white flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed -bottom-64 -left-64 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-64 -right-64 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10">
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
              Join the <span className="italic">studio</span>.
            </h1>
            <p className="text-muted-foreground/70 leading-relaxed max-w-[340px] mx-auto text-sm">
              Create an account for a seamless booking experience and exclusive hair care rewards.
            </p>
          </div>

          <Card className="border-border/40 bg-white/40 backdrop-blur-md shadow-2xl shadow-black/[0.03] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-border/60">
            <CardContent className="p-8 sm:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80 pl-1">
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Maria Santos"
                    {...register("full_name")}
                    className={cn(
                      "h-12 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 transition-all duration-300 placeholder:opacity-50",
                      errors.full_name && "border-destructive/30"
                    )}
                  />
                  {errors.full_name && <p className="text-[10px] font-semibold text-destructive/80 pl-1">{errors.full_name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80 pl-1">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="09XX XXX XXXX"
                    {...register("phone")}
                    className={cn(
                      "h-12 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 transition-all duration-300 placeholder:opacity-50",
                      errors.phone && "border-destructive/30"
                    )}
                  />
                  {errors.phone && <p className="text-[10px] font-semibold text-destructive/80 pl-1">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80 pl-1">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={cn(
                      "h-12 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 transition-all duration-300 placeholder:opacity-50",
                      errors.email && "border-destructive/30"
                    )}
                  />
                  {errors.email && <p className="text-[10px] font-semibold text-destructive/80 pl-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" title="Settings" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80 pl-1">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 chars"
                        {...register("password")}
                        className={cn(
                          "h-12 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 pr-10 transition-all duration-300 placeholder:opacity-50 text-sm",
                          errors.password && "border-destructive/30"
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm_password" title="Settings" className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/80 pl-1">
                      Confirm
                    </Label>
                    <Input
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat it"
                      {...register("confirm_password")}
                      className={cn(
                        "h-12 rounded-2xl bg-white/60 border-border/40 focus:border-foreground/20 transition-all duration-300 placeholder:opacity-50 text-sm",
                        errors.confirm_password && "border-destructive/30"
                      )}
                    />
                  </div>
                </div>
                {(errors.password || errors.confirm_password) && (
                   <div className="space-y-1">
                      {errors.password && <p className="text-[10px] font-semibold text-destructive/80 pl-1">{errors.password.message}</p>}
                      {errors.confirm_password && <p className="text-[10px] font-semibold text-destructive/80 pl-1">{errors.confirm_password.message}</p>}
                   </div>
                )}
                
                <div className="flex items-center gap-2 pl-1 pt-2">
                   <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group"
                   >
                     {showPassword ? <EyeOff className="w-3 h-3 transition-transform group-hover:scale-110" /> : <Eye className="w-3 h-3 transition-transform group-hover:scale-110" />}
                     {showPassword ? "Hide" : "Show"} Passwords
                   </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl text-base font-medium mt-4 shadow-xl shadow-foreground/5 transition-all duration-500 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground/60">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
