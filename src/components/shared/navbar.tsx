"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassFilter, GlassEffect } from "@/components/ui/liquid-glass";
import {
  House,
  Sparkles,
  Images,
  MessageCircleQuestion,
  User,
} from "lucide-react";

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

const NAV_ITEMS = [
  { id: "services", label: "Services", type: "scroll", icon: Sparkles },
  { id: "gallery", label: "Gallery", type: "scroll", icon: Images },
  { id: "home", label: "Valle", type: "scroll", icon: House },
  { id: "faq", label: "FAQ", type: "scroll", icon: MessageCircleQuestion },
  { id: "profile", label: "Login", type: "link", href: "/login", icon: User },
] as const;

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
    ? "font-regular text-[clamp(0.8125rem,0.2vw+0.75rem,0.875rem)]"
    : "font-regular text-[clamp(0.875rem,0.3vw+0.8rem,1rem)]";
  const textColor = scrolled ? "text-white" : "text-black";
  const hoverBg = scrolled ? "bg-white/20" : "bg-black/25";
  const hoverLogo = "bg-white/20";
  const font = "var(--font-sans)";

  // All clickable nav items (buttons + links) share the same pill via layoutId
  const desktopNavItems = [
    { id: "services", label: "Services", type: "scroll" as const },
    { id: "gallery", label: "Gallery", type: "scroll" as const },
    { id: "faq", label: "FAQ", type: "scroll" as const },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 hidden lg:flex justify-center pointer-events-none">
        <GlassFilter />
        <GlassEffect
          showGlass={scrolled}
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? "mt-4 h-16 w-[calc(100%-2rem)] max-w-6xl rounded-full border border-black/10 shadow-[0_8px_30px_rgb(0,0,0,0.10)] px-6 gap-2"
              : "mt-0 h-24 w-full max-w-11/12 rounded-none bg-transparent border-transparent px-16 shadow-none gap-6"
          }`}
        >
          <div
            className="flex justify-between items-center h-full w-full mx-5"
            onMouseLeave={() => setHovered(null)}
          >
            {/* Left Side: Services, Gallery, FAQ */}
            <div className="flex items-center gap-0.5 pl-0 z-10 w-1/2">
              {desktopNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => resilientScrollTo(item.id)}
                  onMouseEnter={() => setHovered(item.id)}
                  className={`relative px-3 py-1.5 rounded-full cursor-pointer tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${textSize} ${textColor}`}
                  style={{ fontFamily: font }}
                >
                  {hovered === item.id && (
                    <motion.span
                      layoutId="nav-pill-desktop"
                      className={`absolute inset-0 rounded-full ${hoverBg}`}
                      transition={SPRING}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Center: Valle logo */}
            <div className="flex flex-col items-center shrink-0">
              <button
                onMouseEnter={() => setHovered("valle")}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`relative px-1.5 rounded-full cursor-pointer hover:opacity-90 transition-all duration-500`}
              >
                {hovered === "valle" && (
                  <motion.span
                    layoutId="nav-pill-desktop"
                    className={`absolute inset-0 rounded-full ${hoverLogo}`}
                    transition={SPRING}
                  />
                )}
                <h2
                  className={`relative z-10 font-heading font-bold uppercase tracking-tighter transition-all duration-500 ${
                    scrolled
                      ? "text-white text-[clamp(1.5rem,4vw,1rem)]"
                      : "text-[#beb9b7] text-[clamp(2.25rem,8vw,2rem)]"
                  }`}
                >
                  Valle
                </h2>
              </button>
            </div>

            {/* Right Side: Login, Book Now */}
            <div className="flex items-center justify-end gap-0.5 z-10 w-1/2">
              <Link
                href="/login"
                onMouseEnter={() => setHovered("login")}
                className={`relative px-3 py-1.5 rounded-full tracking-[0.2em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${textSize} ${textColor}`}
                style={{ fontFamily: font }}
              >
                {hovered === "login" && (
                  <motion.span
                    layoutId="nav-pill-desktop"
                    className={`absolute inset-0 rounded-full ${hoverBg}`}
                    transition={SPRING}
                  />
                )}
                <span className="relative z-10">Login</span>
              </Link>

              <Link
                href="/register"
                onMouseEnter={() => setHovered("book")}
                className={`relative inline-flex items-center justify-center tracking-[0.2em] uppercase rounded-full active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  scrolled
                    ? `text-sm px-4 py-[7px] text-white`
                    : `text-sm px-5 py-2.5 bg-transparent text-black ${textSize}`
                }`}
                style={{ fontFamily: font }}
              > 
                {hovered === "book" && (
                  <motion.span
                    layoutId="nav-pill-desktop"
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

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex lg:hidden justify-center px-4 pointer-events-none">
        <GlassFilter />
        <GlassEffect
          showGlass={true}
          className="pointer-events-auto flex items-center justify-around h-16 w-full max-w-md rounded-full bg-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-2"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHovered = hovered === `mobile-${item.id}`;

            return (
              <div
                key={item.id}
                className="relative flex-1 flex justify-center items-center h-full"
                onMouseEnter={() => setHovered(`mobile-${item.id}`)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.type === "scroll" ? (
                  <button
                    onClick={() => {
                      if (item.id === "home") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        resilientScrollTo(item.id);
                      }
                    }}
                    className="cursor-pointer relative flex flex-col items-center justify-center gap-1 w-full h-full text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {isHovered && (
                      <motion.span
                        layoutId="nav-pill-mobile"
                        className="absolute inset-x-1 inset-y-1 bg-white/10 rounded-2xl -z-10"
                        transition={SPRING}
                      />
                    )}
                    <Icon size={22} strokeWidth={1.5} />
                    <span className="text-[0.625rem] font-medium uppercase tracking-widest">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="relative flex flex-col items-center justify-center gap-1 w-full h-full text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {isHovered && (
                      <motion.span
                        layoutId="nav-pill-mobile"
                        className="absolute inset-x-1 inset-y-1 bg-white/10 rounded-2xl -z-10"
                        transition={SPRING}
                      />
                    )}
                    <Icon size={22} strokeWidth={1.5} />
                    <span className="text-[0.625rem] font-medium uppercase tracking-widest">
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </GlassEffect>
      </div>
    </>
  );
}
