'use client'

import { useEffect, useState } from 'react'
import { Loader2, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { Service, ServiceCategory, BookingFormData } from '@/types'

interface Props {
  formData: BookingFormData
  updateForm: (updates: Partial<BookingFormData>) => void
  onNext: () => void
  initialCategory: ServiceCategory | null
}

const CATEGORIES: { value: ServiceCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All Services', emoji: '✨' },
  { value: 'hair', label: 'Hair', emoji: '✂️' },
  { value: 'nails', label: 'Nails', emoji: '💅' },
  { value: 'brows', label: 'Brows', emoji: '🪄' },
]

function formatPrice(price: number) {
  return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`
}

function formatDuration(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function StepService({ formData, updateForm, onNext, initialCategory }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<ServiceCategory | 'all'>(initialCategory ?? 'all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('price')
      .then(({ data }) => {
        setServices(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = services.filter((s) => {
    const matchCat = category === 'all' || s.category === category
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSelect = (service: Service) => {
    updateForm({ service_id: service.id, service })
  }

  const canContinue = !!formData.service_id

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                category === cat.value
                  ? 'gradient-brand text-white border-transparent shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Services grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No services found for &ldquo;{search}&rdquo;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((service) => {
            const isSelected = formData.service_id === service.id
            return (
              <button
                key={service.id}
                onClick={() => handleSelect(service)}
                className={`text-left rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
                aria-pressed={isSelected}
                id={`service-${service.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs category-${service.category} mb-1`}
                    >
                      {service.category}
                    </Badge>
                    <h3 className="font-semibold text-sm leading-snug">{service.name}</h3>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                {service.description && (
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    ~{formatDuration(service.duration_min)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Selected summary + next */}
      {formData.service && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Selected</p>
            <p className="font-semibold text-sm">{formData.service.name}</p>
            <p className="text-primary font-bold">{formatPrice(formData.service.price)}</p>
          </div>
          <Button
            onClick={onNext}
            className="gradient-brand text-white border-0 shadow-sm shadow-primary/30"
            disabled={!canContinue}
          >
            Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {!formData.service_id && !loading && (
        <p className="text-center text-sm text-muted-foreground">
          Select a service above to continue
        </p>
      )}
    </div>
  )
}
