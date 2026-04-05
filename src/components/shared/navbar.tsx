"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export const HairBlowerIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    {...props}
  >
    {/* Circle Cord */}
    <path d="M50,91 C27.356,91 9,72.644 9,50 C9,27.356 27.356,9 50,9 C72.644,9 91,27.356 91,50 C91,66 82,75.5 68,75 C60,74.7 57.5,69 59,62 L63,62 C61.5,67 63,71.5 68,72 C78,72.5 87,63 87,50 C87,29.565 70.435,13 50,13 C29.565,13 13,29.565 13,50 C13,70.435 29.565,87 50,87 C51.5,87 53,86.8 54.5,86.4 L54.5,90 C53,90.5 51.5,91 50,91 Z" />
    
    {/* Plug */}
    <rect x="40" y="86" width="20" height="9" rx="2" />
    <rect x="44" y="95" width="4" height="5" />
    <rect x="52" y="95" width="4" height="5" />

    {/* Blower Body */}
    <path d="M62,34 C58,33 48,39 35,45 L25,49 L28,58 L33,54 C39,50 45,46 51,53 C55,57.5 59,63 61,65 C64,68 67,65 67,65 C67,65 63,55 64,49 C65,43 68,39 68,39 C68,39 66,35 62,34 Z" />
    
    {/* Nozzle end */}
    <polygon points="26,48 20,50 23,60 29,57" />
    
    {/* White Vent Lines */}
    <line x1="53" y1="41" x2="56" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="43" x2="53" y2="46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="47" y1="45" x2="50" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname(); 

  if (pathname === "/gallery" || pathname === "/book" || pathname === "/login" || pathname === "/register" || pathname === "/dashboard") return null;

  const navLinkStyles = `text-[12px] sm:text-xs font-bold tracking-[0.2em] text-black uppercase hover:opacity-70 transition-all`;

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
      <nav className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16 relative pointer-events-auto">
        <div className="flex justify-between items-center h-23 w-full">
          {/* Left Side: Valle + Blower, Services, FAQ */}
          <div className="flex items-center gap-6 sm:gap-10 pl-0 z-10 w-1/2">
            <Link href="/" className="flex items-center gap-1.5 uppercase text-black font-semibold text-[12px] sm:text-xs tracking-[0.2em] hover:opacity-80 transition-opacity" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span>Valle Studio</span>
              {/* hair blower icon */}
              <HairBlowerIcon className="w-7 h-7 sm:w-8 sm:h-8 text-black" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </Link>
            <Link href="/#services" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              Services
            </Link>
            <Link href="/#faq" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              FAQ
            </Link>
          </div>


          {/* Right Side: Sign in & Book Now */}
          <div className="flex items-center justify-end gap-6 sm:gap-10 pr-0 z-10 w-1/2">
            <Link href="/login" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              Login
            </Link>
            <Link href="/register" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              Book Now
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
