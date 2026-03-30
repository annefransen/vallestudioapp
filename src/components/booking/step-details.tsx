'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Tag, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import type { BookingFormData, Promotion } from '@/types'
import { toast } from 'sonner'

interface Props {
  formData: BookingFormData
  updateForm: (updates: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
  isLoggedIn: boolean
}

const guestSchema = z.object({
  guest_name: z.string().min(2, 'Name must be at least 2 characters'),
  guest_phone: z.string().regex(/^(\+63|0)\d{10}$/, 'Enter a valid Philippine phone number'),
  guest_email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
})
type GuestForm = z.infer<typeof guestSchema>

export function StepDetails({ formData, updateForm, onNext, onBack, isLoggedIn }: Props) {
  const [promoCode, setPromoCode] = useState(formData.promo_code)
  const [promoLoading, setPromoLoading] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)
  const [promoError, setPromoError] = useState('')
  const [profileLoaded, setProfileLoaded] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<GuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guest_name: formData.guest_name,
      guest_phone: formData.guest_phone,
      guest_email: formData.guest_email,
      notes: formData.notes,
    },
  })

  // Pre-fill logged-in user's profile
  useEffect(() => {
    if (isLoggedIn && !profileLoaded) {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single()
        if (profile) {
          setValue('guest_name', profile.full_name)
          if (profile.phone) setValue('guest_phone', profile.phone)
          setValue('guest_email', user.email ?? '')
          updateForm({
            guest_name: profile.full_name,
            guest_phone: profile.phone ?? '',
            guest_email: user.email ?? '',
          })
        }
        setProfileLoaded(true)
      })
    }
  }, [isLoggedIn])

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError('')
    setAppliedPromo(null)

    const { data: promo, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', promoCode.toUpperCase())
      .eq('is_active', true)
      .gte('valid_to', new Date().toISOString().split('T')[0])
      .single()

    if (error || !promo) {
      setPromoError('Invalid or expired promo code')
      setPromoLoading(false)
      return
    }

    // Check max uses
    if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
      setPromoError('Promo code has reached its usage limit')
      setPromoLoading(false)
      return
    }

    // Check minimum amount
    const servicePrice = formData.service?.price ?? 0
    if (servicePrice < promo.min_amount) {
      setPromoError(`Minimum order of ₱${promo.min_amount} required for this promo`)
      setPromoLoading(false)
      return
    }

    setAppliedPromo(promo)
    updateForm({ promo_code: promoCode.toUpperCase() })
    toast.success(`Promo applied! ${promo.discount_type === 'percent' ? `${promo.discount_value}% off` : `₱${promo.discount_value} off`}`)
    setPromoLoading(false)
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoCode('')
    setPromoError('')
    updateForm({ promo_code: '' })
  }

  const onSubmit = (data: GuestForm) => {
    updateForm({
      guest_name: data.guest_name,
      guest_phone: data.guest_phone,
      guest_email: data.guest_email ?? '',
      notes: data.notes ?? '',
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isLoggedIn && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Your profile details have been pre-filled. You can edit them if needed.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="guest_name">Full Name *</Label>
          <Input
            id="guest_name"
            placeholder="Maria Santos"
            {...register('guest_name')}
            onChange={(e) => updateForm({ guest_name: e.target.value })}
            className={errors.guest_name ? 'border-destructive' : ''}
          />
          {errors.guest_name && <p className="text-xs text-destructive">{errors.guest_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="guest_phone">Phone Number *</Label>
          <Input
            id="guest_phone"
            placeholder="09XX XXX XXXX"
            {...register('guest_phone')}
            onChange={(e) => updateForm({ guest_phone: e.target.value })}
            className={errors.guest_phone ? 'border-destructive' : ''}
          />
          {errors.guest_phone && <p className="text-xs text-destructive">{errors.guest_phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="guest_email">
          Email <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="guest_email"
          type="email"
          placeholder="you@example.com"
          {...register('guest_email')}
          onChange={(e) => updateForm({ guest_email: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">
          Notes <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Any special requests or allergies to products…"
          rows={3}
          {...register('notes')}
          onChange={(e) => updateForm({ notes: e.target.value })}
          className="resize-none"
        />
      </div>

      {/* Promo code */}
      <div className="space-y-2">
        <Label htmlFor="promo_code">
          <Tag className="w-3.5 h-3.5 inline mr-1" />
          Promo Code <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>

        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">{appliedPromo.code}</span>
              <span>—</span>
              <span>
                {appliedPromo.discount_type === 'percent'
                  ? `${appliedPromo.discount_value}% off`
                  : `₱${appliedPromo.discount_value} off`}
              </span>
            </div>
            <button
              type="button"
              onClick={removePromo}
              className="text-green-600 hover:text-red-500 transition-colors"
              aria-label="Remove promo"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              id="promo_code"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value)
                setPromoError('')
              }}
              className={promoError ? 'border-destructive uppercase' : 'uppercase'}
            />
            <Button
              type="button"
              variant="outline"
              onClick={applyPromo}
              disabled={promoLoading || !promoCode.trim()}
              className="shrink-0"
            >
              {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </Button>
          </div>
        )}
        {promoError && <p className="text-xs text-destructive">{promoError}</p>}
      </div>

      {!isLoggedIn && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
          💡 <a href="/register" className="text-primary underline underline-offset-2">Create a free account</a> to save your info and view booking history.
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-none">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button type="submit" className="flex-1 gradient-brand text-white border-0 shadow-sm shadow-primary/30">
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  )
}
