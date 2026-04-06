"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassFilter, GlassEffect } from "@/components/ui/liquid-glass";

const SCROLL_THRESHOLD = 150;
const DEFAULT_NAV_HEIGHT = 96;
const ISLAND_NAV_HEIGHT = 64;

function resilientScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const elementPosition = el.getBoundingClientRect().top + window.scrollY;

  // Decide offset
  let targetOffset = DEFAULT_NAV_HEIGHT;
  if (elementPosition - ISLAND_NAV_HEIGHT > SCROLL_THRESHOLD) {
    targetOffset = ISLAND_NAV_HEIGHT;
  }

  const targetY = Math.max(0, elementPosition - targetOffset);
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 200; // ms
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // easeOutExpo - maximum snappy start
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

const SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 35,
  mass: 0.8,
} as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 150);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (
    pathname === "/gallery" ||
    pathname === "/book" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/dashboard"
  )
    return null;

  const textSize = scrolled
    ? "font-regular text-[12px] lg:text-sm"
    : "font-regular text-[12px] lg:text-base";
  const textColor = scrolled ? "text-white" : "text-black";
  const hoverBg = scrolled ? "bg-white/20" : "bg-black/25";
  const hoverLogo = "bg-white/20";
  const font = "var(--font-sans)";

  // All clickable nav items (buttons + links) share the same pill via layoutId
  const navItems = [
    { id: "services", label: "Services", type: "scroll" as const },
    { id: "faq", label: "FAQ", type: "scroll" as const },
    {
      id: "register",
      label: "Sign In",
      type: "link" as const,
      href: "/register",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <GlassFilter />
      <GlassEffect
        showGlass={scrolled}
        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "mt-4 lg:mt-6 h-16 w-[calc(100%-2rem)] max-w-6xl rounded-full border border-black/10 shadow-[0_8px_30px_rgb(0,0,0,0.10)] px-4 lg:px-6 gap-2"
            : "mt-0 h-20 lg:h-24 w-full max-w-11/12 rounded-none bg-transparent border-transparent px-8 lg:px-16 shadow-none gap-6"
        }`}
      >
        <div
          className="flex justify-between items-center h-full w-full mx-5"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Left Side: Services, FAQ */}
          <div className="flex items-center gap-0.5 pl-0 z-10 w-1/2">
            {/* Services */}
            <button
              onClick={() => resilientScrollTo("services")}
              onMouseEnter={() => setHovered("services")}
              className={`relative px-3 py-1.5 rounded-full cursor-pointer tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-sm ${textColor}`}
              style={{ fontFamily: font }}
            >
              {hovered === "services" && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-full ${hoverBg}`}
                  transition={SPRING}
                />
              )}
              <span className="relative z-10">Services</span>
            </button>
            <button
              onClick={() => resilientScrollTo("gallery")}
              onMouseEnter={() => setHovered("gallery")}
              className={`relative px-3 py-1.5 rounded-full cursor-pointer tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${textSize} ${textColor}`}
              style={{ fontFamily: font }}
            >
              {hovered === "gallery" && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-full ${hoverBg}`}
                  transition={SPRING}
                />
              )}
              <span className="relative z-10">gallery</span>
            </button>

            {/* FAQ */}
            <button
              onClick={() => resilientScrollTo("faq")}
              onMouseEnter={() => setHovered("faq")}
              className={`relative px-3 py-1.5 rounded-full cursor-pointer tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-sm ${textColor}`}
              style={{ fontFamily: font }}
            >
              {hovered === "faq" && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-full ${hoverBg}`}
                  transition={SPRING}
                />
              )}
              <span className="relative z-10">FAQ</span>
            </button>
          </div>

          {/* Center: Valle logo */}
          <div className="flex flex-col items-center shrink-0">
            <button
              onMouseEnter={() => setHovered("valle")}
              onClick={() => {
                const startY = window.scrollY;
                const duration = 200; // ms
                let startTime: number | null = null;

                function animation(currentTime: number) {
                  if (startTime === null) startTime = currentTime;
                  const timeElapsed = currentTime - startTime;
                  const progress = Math.min(timeElapsed / duration, 1);

                  // easeOutExpo
                  const ease =
                    progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                  window.scrollTo(0, startY + (0 - startY) * ease);

                  if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                  }
                }
                requestAnimationFrame(animation);
              }}
              className={`relative px-1.5  rounded-full cursor-pointer hover:opacity-90 transition-all duration-500`}
            >
              {hovered === "valle" && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-full ${hoverLogo}`}
                  transition={SPRING}
                />
              )}
              <h2
                className={`relative z-10 font-heading font-black uppercase tracking-tighter transition-all duration-500 ${
                  scrolled
                    ? "text-white text-xl lg:text-2xl"
                    : "text-[#beb9b7] text-3xl lg:text-4xl"
                }`}
              >
                Valle
              </h2>
            </button>
          </div>

          {/* Right Side: Sign In, Book Now */}
          <div className="flex items-center justify-end gap-0.5 z-10 w-1/2">
            {/* Sign In */}
            <Link
              href="/login"
              onMouseEnter={() => setHovered("register")}
              className={`relative px-3 py-1.5 rounded-full tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-sm ${textColor}`}
              style={{ fontFamily: font }}
            >
              {hovered === "register" && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-full ${hoverBg}`}
                  transition={SPRING}
                />
              )}
              <span className="relative z-10">Login</span>
            </Link>

            {/* Book Now — solid pill CTA with shared hover */}
            <Link
              href="/register"
              onMouseEnter={() => setHovered("book")}
              className={`relative inline-flex items-center justify-center tracking-[0.2em] uppercase rounded-full active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                scrolled
                  ? `text-sm px-4 py-[7px] text-white`
                  : `text-sm px-5 py-2.5 bg-transparent text-black`
              }`}
              style={{ fontFamily: font }}
            >
              {hovered === "book" && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-full ${hoverBg}`}
                  transition={SPRING}
                />
              )}
              <span className="relative z-10">Book Now</span>
            </Link>
          </div>
        </div>
      </GlassEffect>
    </div>
  );
}
