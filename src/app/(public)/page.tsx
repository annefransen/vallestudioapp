'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Scissors, Sparkles, Star, ArrowRight, Clock, Shield, CreditCard, CheckCircle2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  {
    icon: '✂️',
    category: 'hair',
    title: 'Hair Services',
    description: 'Precision cuts, vibrant colors, and luxurious treatments by our expert stylists.',
    items: ['Haircut & Style', 'Hair Color', 'Highlights', 'Hair Treatment', 'Blowout'],
  },
  {
    icon: '💅',
    category: 'nails',
    title: 'Nail Services',
    description: 'From classic manicures to intricate nail art — perfect nails every time.',
    items: ['Classic Manicure', 'Classic Pedicure', 'Gel Nails', 'Nail Art'],
  },
  {
    icon: '🪄',
    category: 'brows',
    title: 'Brow Services',
    description: 'Shape and define your brows with our precision threading and tinting services.',
    items: ['Eyebrow Threading', 'Eyebrow Tinting', 'Brow Lamination'],
  },
]

const testimonials = [
  {
    name: 'Maria Santos',
    rating: 5,
    text: 'Best salon experience in the city! The staff is incredibly skilled and the ambiance is so relaxing.',
    service: 'Hair Color',
  },
  {
    name: 'Ana Reyes',
    rating: 5,
    text: 'My gel nails last so much longer here. Love the nail art designs they offer!',
    service: 'Gel Nails',
  },
  {
    name: 'Carla Flores',
    rating: 5,
    text: 'The brow lamination is absolutely life-changing. My brows have never looked this good.',
    service: 'Brow Lamination',
  },
]

const features = [
  {
    icon: Clock,
    title: 'Easy Scheduling',
    description: 'Book your preferred time slot in seconds — no phone calls needed.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay via Cash, GCash in-store, or online GCash — all payment methods accepted.',
  },
  {
    icon: Shield,
    title: 'Trusted Experts',
    description: 'All our stylists are trained professionals with years of experience.',
  },
  {
    icon: CheckCircle2,
    title: 'Booking Confirmation',
    description: 'Receive instant confirmation of your appointment details.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.02_285)] via-[oklch(0.25_0.03_285)] to-[oklch(0.15_0.015_340)]" />
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[oklch(0.78_0.12_72)]/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.1_0.015_285)_100%)]" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 cursor-default">
              <Sparkles className="w-3 h-3 mr-1" />
              Now accepting online bookings
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-white leading-tight mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Your Beauty,{' '}
            <span className="text-gradient-gold">Our Craft</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Experience premium hair, nails, and brow services at Valle Studio Salon.
            Book your appointment online in seconds — no waiting on hold.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Link href="/book" className={buttonVariants({ size: "lg", className: "gradient-brand text-white border-0 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-200 text-base h-12 px-8" })}>
                Book Your Appointment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            <Link href="/#services" className={buttonVariants({ variant: "outline", size: "lg", className: "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm text-base h-12 px-8" })}>Explore Services</Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-14 flex items-center justify-center gap-6 text-white/60 text-sm"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[oklch(0.78_0.12_72)] text-[oklch(0.78_0.12_72)]" />
                ))}
              </div>
              <span className="font-medium text-white">4.9/5</span>
            </div>
            <span>·</span>
            <span>500+ happy clients</span>
            <span>·</span>
            <span>Open 6 days a week</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                <Scissors className="w-3 h-3 mr-1" />
                Our Services
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                What We Offer
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose from our range of professional beauty services, all performed
                by trained and passionate stylists.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="h-2 gradient-brand" />
                  <CardContent className="p-8 space-y-4">
                    <div className="text-4xl">{service.icon}</div>
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-xs mb-3 category-${service.category}`}
                      >
                        {service.category}
                      </Badge>
                      <h3 className="text-xl font-heading font-bold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/book?category=${service.category}`} className={buttonVariants({ variant: "outline", className: "w-full group-hover:gradient-brand group-hover:text-white group-hover:border-0 transition-all duration-300" })}>
                        Book {service.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-muted/50 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 text-primary border-primary/30">
                Client Love
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                What Our Clients Say
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-[oklch(0.78_0.12_72)] text-[oklch(0.78_0.12_72)]" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                          {t.name[0]}
                        </div>
                        <span className="font-semibold text-sm">{t.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">{t.service}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.02_285)] to-[oklch(0.35_0.08_335)]" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[oklch(0.78_0.12_72)]/10 blur-3xl" />
            <div className="relative z-10 text-center py-16 px-8">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                Ready for Your Glow-Up?
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Schedule your next appointment at Valle Studio Salon.
                We're open Monday through Saturday, 9:30 AM – 7:00 PM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book" className={buttonVariants({ size: "lg", className: "gradient-brand text-white border-0 shadow-lg shadow-primary/30 hover:scale-105 transition-transform h-12 px-8 text-base" })}>
                    Book Now — It's Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                <Link href="/register" className={buttonVariants({ variant: "outline", size: "lg", className: "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white h-12 px-8 text-base" })}>Create an Account</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
