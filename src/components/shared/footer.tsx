"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#2e2721] text-[#beb9b7] pt-25 pb-5 px-6 sm:px-12 lg:px-24 font-sans select-none cursor-default">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-25 mb-25 font-sans">
          
          {/* Brand Column (Heading & Subtitle & Hours) */}
          <div className="flex flex-col">
            <h2 className="text-[100px] font-heading font-black uppercase tracking-tighter mb-4 flex flex-col leading-[0.85] text-[#beb9b7]">
              <span>Valle</span>
              <span className="opacity-70">Studio</span>
            </h2>
          </div>

          {/* Column 2: Quick links */}
          <div className="font-sans lg:pl-30">
            <h4 className="text-[17px] font-sans font-bold text-[#beb9b7] mb-6">Quick links</h4>
            <ul className="space-y-4 text-[17px]">
              <li><Link href="/#about" className="hover:opacity-70 transition-opacity">About us</Link></li>
              <li><Link href="/#services" className="hover:opacity-70 transition-opacity">Services</Link></li>
              <li><Link href="/#gallery" className="hover:opacity-70 transition-opacity">Gallery</Link></li>
              <li><Link href="/#faq" className="hover:opacity-70 transition-opacity">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact us */}
          <div className="font-sans">
            <h4 className="text-[17px] font-sans font-bold text-[#beb9b7] mb-6">Contact us</h4>
            <ul className="space-y-4 text-[17px]">
              <li className="flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>0908 863 2831</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>J&D Alex Bldg, Siling Bata, Pandi, Bulacan</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>vallestudiosalon@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="font-sans">
            <h4 className="text-[17px] font-sans font-bold text-[#beb9b7] mb-2">We&apos;re open:</h4>
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[17px]">Mon – Sun: 9:30AM – 7PM</p>
            </div>

            <h4 className="text-[17px] font-sans font-bold text-[#beb9b7] mb-6">Follow us</h4>
            <div className="flex items-center gap-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>


        </div>

        {/* Footer Bottom refined per latest request: line closer, larger text, no uppercase */}
        <div className="pt-5 border-t border-[#beb9b7]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-sans">
          <p>© 2026 Valle Studio. All rights reserved.</p>
          <Link href="/terms" className="hover:opacity-70 transition-opacity text-[13px]">User Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
