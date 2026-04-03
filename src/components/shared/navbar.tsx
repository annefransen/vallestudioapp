"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Animation transforms for the logo
  const logoY = useTransform(scrollY, [0, 400], ["42vh", "0vh"]); 
  const logoScale = useTransform(scrollY, [0, 400], [8.5, 1.5]); 
  const logoColor = useTransform(scrollY, [0, 300], ["#ffffff", "#3D2B1F"]); 

  if (pathname === "/portfolio") return null;

  const darkBrown = "text-[#3D2B1F]"; // Rich espresso/dark brown color
  const navLinkStyles = `text-[10px] sm:text-xs font-semibold tracking-[0.2em] ${darkBrown} uppercase hover:opacity-70 transition-all`;

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
      <nav className="max-w-[1760px] mx-auto px-6 sm:px-12 lg:px-16 relative pointer-events-auto">
        <div className="flex justify-between items-center h-20 w-full">
          
          {/* Left Side: About Us, Services, Gallery */}
          <div className="flex items-center gap-6 sm:gap-12 pl-0 z-10">
            <Link href="/#about" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              About Us
            </Link>
            <Link href="/#services" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              Services
            </Link>
            <Link href="/#gallery" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              Gallery
            </Link>
          </div>

          {/* Centered Animated Logo */}
          <motion.div
            style={{
              y: logoY,
              scale: logoScale,
              x: "-50%",
              originY: 0.5,
              color: logoColor,
            }}
            className="absolute left-1/2 top-1/3 -translate-y-1/3 flex flex-col items-center justify-center font-heading font-black leading-[0.85] tracking-tighter uppercase pointer-events-none mt-[4px] sm:mt-[6px]"
          >
            <span className="drop-shadow-sm">Valle</span>
            <span className="opacity-90 drop-shadow-sm">Studio</span>
          </motion.div>

          {/* Right Side: FAQ & Book Now */}
          <div className="flex items-center gap-6x sm:gap-12 pr-6 z-10">
            <Link href="/#faq" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              FAQ
            </Link>
            <Link href="/book" className={navLinkStyles} style={{ fontFamily: "'Inter', sans-serif" }}>
              Book Now
            </Link>
          </div>
          
        </div>
      </nav>
    </motion.header>
  );
}
