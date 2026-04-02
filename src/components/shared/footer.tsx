import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-10 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-heading font-black tracking-tighter uppercase mb-6 flex flex-col leading-[0.85]">
              <span>Valle</span>
              <span className="opacity-70">Studio</span>
            </h2>
            <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-xs mb-6">
              Elevating your beauty with precision, artistry, and exceptional care. Your sanctuary for luxury salon services.
            </p>
            <div className="flex items-center gap-4">
              {/* Simple Social Icons placeholders */}
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                TT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-300">Quick Links</h4>
            <ul className="space-y-4 font-sans text-sm text-gray-400">
              <li><Link href="/#services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/#team" className="hover:text-white transition-colors">The Team</Link></li>
              <li><Link href="/#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-300">Contact Us</h4>
            <ul className="space-y-4 font-sans text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Beauty Avenue,<br />Manila, Philippines 1000</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+63 912 345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@vallestudiosalon.com</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-300">Hours</h4>
            <div className="space-y-3 font-sans text-sm text-gray-400">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Mon - Fri</span>
                <span>9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Saturday</span>
                <span>10:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
            <button className="mt-6 w-full py-3 bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors">
              Book Appointment
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-gray-500">
          <p>© {new Date().getFullYear()} Valle Studio Salon. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
