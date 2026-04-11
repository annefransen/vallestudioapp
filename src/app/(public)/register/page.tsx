// REGISTER PAGE

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Particles } from "@/components/ui/Particles";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function RegisterPage() {
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
      toast.error("An unexpected error occurred during Google Sign-up");
      console.error(err);
    }
  };

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
      <div className="absolute top-8 left-8 z-50">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 transition-all font-medium text-[0.875rem] group hover:text-black text-[#111118]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Home
        </Link>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        <div className="mx-auto space-y-10 sm:w-sm animate-in fade-in duration-1000">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="font-sans text-[clamp(2.5rem,5vw+1.80rem,4.5rem)] font-bold tracking-tight leading-[1.20] select-none cursor-default">
                Sign Up <span className="italic">or</span> <br /> Book Now.
              </h1>
              <p className="font-sans text-muted-foreground text-xl leading-relaxed mx-auto select-none cursor-default">
                Let the glamour unfold.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Button
              type="button"
              size="lg"
              className="w-full h-13 rounded-[5px] bg-[#dddddd] text-base font-semibold text-black border-border/40 hover:bg-[#d0d0d0] hover:text-black transition-all duration-300 shadow-xl shadow-black/2 cursor-pointer"
              onClick={handleGoogleSignIn}
            >
              <svg width="23" height="23" viewBox="0 0 23 23" className="me-2">
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
              Sign Up with Google
            </Button>

            <Button
              type="button"
              size="lg"
              className="w-full h-13 rounded-[5px] text-base font-semibold bg-[#2a2a2a] text-white hover:bg-[#2a2a2a]/95 transition-all duration-300 shadow-xl shadow-black/10"
              asChild
            >
              <Link href="/book">
                <CalendarIcon className="me-2 size-5" />
                Book as guest
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
