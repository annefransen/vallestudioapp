import Link from 'next/link'
import { Scissors, MapPin, Phone, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-white">Valle Studio</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              Your premier destination for professional hair, nails, and brow services.
              Book your appointment online and experience the Valle Studio difference.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/#services', label: 'Services' },
                { href: '/book', label: 'Book Appointment' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Create Account' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Contact & Hours</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>Valle Studio Salon<br />Your City, Philippines</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-sidebar-foreground/70">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+63 912 345 6789</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <p>Mon – Sat: 9:30 AM – 7:00 PM</p>
                  <p>Sunday: 10:00 AM – 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sidebar-foreground/50">
            © {new Date().getFullYear()} Valle Studio Salon. All rights reserved.
          </p>
          <p className="text-xs text-sidebar-foreground/50">
            Powered by secure GCash payments via Xendit
          </p>
        </div>
      </div>
    </footer>
  )
}
