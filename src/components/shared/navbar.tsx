"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Animation transforms for the logo
  // When scrollY is 0, logo is ~42vh down (centered in hero) and scaled up by 4.5x.
  // When scrollY is 400+, logo returns to y: 0 and scale: 0.8 (normal navbar size).
  const logoY = useTransform(scrollY, [0, 400], ["42vh", "0vh"]); // Shifted from 36vh to 42vh for perfect vertical centering
  const logoScale = useTransform(scrollY, [0, 400], [8.5, 1.5]); // 10x scale for massive hero, 1.5x final navbar size
  const logoColor = useTransform(scrollY, [0, 300], ["#ffffff", "#3D2B1F"]); // Transition from white to dark brown

  if (pathname === "/portfolio") return null;

  const darkBrown = "text-[#3D2B1F]"; // Rich espresso/dark brown color

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
      <nav className="max-w-[1750px] mx-auto px-6 sm:px-12 lg:px-16 relative pointer-events-auto">
        <div className="flex justify-between items-center h-20 w-full">
          {/* Left Side: Services, Team, FAQ */}
          <div className="flex items-center gap-6 sm:gap-12 pl-2 z-10">
            <Link
              href="/#services"
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] ${darkBrown} uppercase hover:opacity-70 transition-all`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Services
            </Link>
            <Link
              href="/#team"
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] ${darkBrown} uppercase hover:opacity-70 transition-all`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Team
            </Link>
            <Link
              href="/#faq"
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] ${darkBrown} uppercase hover:opacity-70 transition-all`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              FAQ
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
            className="absolute left-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center font-heading font-black leading-[0.85] tracking-tighter uppercase pointer-events-none mt-[4px] sm:mt-[6px]"
          >
            <span className="drop-shadow-sm">Valle</span>
            <span className="opacity-90 drop-shadow-sm">Studio</span>
          </motion.div>

          {/* Right Side: About Us & Book Now */}
          <div className="flex items-center gap-6 sm:gap-12 pr-2 z-10">
            <Link
              href="/#about"
              className={`hidden sm:block text-[11px] sm:text-xs font-semibold tracking-[0.2em] ${darkBrown} uppercase hover:opacity-70 transition-all`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              About Us
            </Link>
            <Link
              href="/book"
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] ${darkBrown} uppercase hover:opacity-70 transition-all`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
