'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Scissors, Calendar, User, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Service, BookingFormData } from '@/types'

// Step imports
import { StepService } from '@/components/booking/step-service'
import { StepSchedule } from '@/components/booking/step-schedule'
import { StepDetails } from '@/components/booking/step-details'
import { StepPayment } from '@/components/booking/step-payment'

const STEPS = [
  { id: 1, label: 'Service', icon: Scissors },
  { id: 2, label: 'Schedule', icon: Calendar },
  { id: 3, label: 'Details', icon: User },
  { id: 4, label: 'Payment', icon: CreditCard },
]

const defaultFormData: BookingFormData = {
  service_id: '',
  booking_date: '',
  booking_time: '',
  stylist_name: '',
  is_guest: true,
  guest_name: '',
  guest_phone: '',
  guest_email: '',
  promo_code: '',
  notes: '',
  payment_method: 'cash',
}

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Pre-select category from URL param
  const categoryParam = searchParams.get('category') as Service['category'] | null

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true)
        setFormData(prev => ({ ...prev, is_guest: false }))
      }
    })
  }, [])

  const updateForm = useCallback((updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -40 : 40,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/40 to-background pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold mb-2">Book Your Appointment</h1>
          <p className="text-muted-foreground">
            Complete the steps below to reserve your slot at Valle Studio.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                disabled={s.id > step}
                className={`flex flex-col items-center gap-1.5 group focus:outline-none ${
                  s.id < step ? 'cursor-pointer' : 'cursor-default'
                }`}
                aria-label={`Step ${s.id}: ${s.label}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    s.id < step
                      ? 'gradient-brand text-white shadow-md shadow-primary/30'
                      : s.id === step
                      ? 'gradient-brand text-white shadow-lg shadow-primary/40 scale-110'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.id < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  s.id === step ? 'text-primary' : s.id < step ? 'text-muted-foreground' : 'text-muted-foreground/50'
                }`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-0.5 mx-1 sm:mx-2 transition-all duration-300 ${
                    s.id < step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <StepService
                formData={formData}
                updateForm={updateForm}
                onNext={nextStep}
                initialCategory={categoryParam}
              />
            )}
            {step === 2 && (
              <StepSchedule
                formData={formData}
                updateForm={updateForm}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {step === 3 && (
              <StepDetails
                formData={formData}
                updateForm={updateForm}
                onNext={nextStep}
                onBack={prevStep}
                isLoggedIn={isLoggedIn}
              />
            )}
            {step === 4 && (
              <StepPayment
                formData={formData}
                updateForm={updateForm}
                onBack={prevStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
