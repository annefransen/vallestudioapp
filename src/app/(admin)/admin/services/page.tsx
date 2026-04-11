'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/Dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select'
import { createClient } from '@/lib/supabase/client'
import type { Service, ServiceCategory } from '@/types'
import { toast } from 'sonner'

function parseInterval(intervalStr: string) {
  if (!intervalStr) return 0
  // Supabase PG intervals often return "01:00:00" string formats
  const [h, m] = intervalStr.split(':').map(Number)
  return ((h || 0) * 60) + (m || 0)
}

function formatInterval(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
}

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  category: z.enum(['hair', 'nails', 'brows']),
  duration_min: z.coerce.number().min(15).max(480),
  price: z.coerce.number().min(1),
  is_active: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

export type AdminService = {
  id: string
  name: string
  description: string | null
  category: ServiceCategory
  duration_min: number
  price: number
  is_active: boolean
}

const CATEGORIES: { value: ServiceCategory; label: string; emoji: string }[] = [
  { value: 'hair', label: 'Hair', emoji: '✂️' },
  { value: 'nails', label: 'Nails', emoji: '💅' },
  { value: 'brows', label: 'Brows', emoji: '🪄' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<AdminService[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminService | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { category: 'hair', is_active: true, duration_min: 60 },
  })

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*').order('category').order('price')
    if (data) {
      const mapped = data.map((s: any) => ({
        id: s.service_id,
        name: s.service_name,
        description: s.description,
        category: s.category as ServiceCategory,
        duration_min: parseInterval(s.duration),
        price: Number(s.price),
        is_active: s.status === 'available'
      }))
      setServices(mapped)
    }
    setLoading(false)
  }

  useEffect(() => { loadServices() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ category: 'hair', is_active: true, duration_min: 60, price: 0 })
    setOpen(true)
  }

  const openEdit = (service: AdminService) => {
    setEditing(service)
    reset({
      name: service.name,
      description: service.description ?? '',
      category: service.category,
      duration_min: service.duration_min,
      price: service.price,
      is_active: service.is_active,
    })
    setOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    
    const dbPayload = {
      service_name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      price_type: 'standard',
      duration: formatInterval(data.duration_min),
      status: data.is_active ? 'available' : 'unavailable'
    }

    if (editing) {
      const { error } = await supabase.from('services').update(dbPayload).eq('service_id', editing.id)
      if (error) { toast.error('Failed to update service'); setSubmitting(false); return }
      toast.success('Service updated')
    } else {
      const { error } = await supabase.from('services').insert(dbPayload)
      if (error) { toast.error('Failed to add service'); setSubmitting(false); return }
      toast.success('Service added')
    }
    setOpen(false)
    setSubmitting(false)
    loadServices()
  }

  const toggleActive = async (service: AdminService) => {
    const newStatus = service.is_active ? 'unavailable' : 'available'
    const { error } = await supabase
      .from('services')
      .update({ status: newStatus })
      .eq('service_id', service.id)
    if (!error) {
      toast.success(newStatus === 'available' ? 'Service activated' : 'Service deactivated')
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s))
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service? This cannot be undone.')) return
    const { error } = await supabase.from('services').delete().eq('service_id', id)
    if (error) { toast.error('Cannot delete service with existing bookings'); return }
    toast.success('Service deleted')
    setServices(prev => prev.filter(s => s.id !== id))
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = services.filter(s => s.category === cat.value)
    return acc
  }, {} as Record<ServiceCategory, AdminService[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-heading font-bold">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage salon services and pricing</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-brand text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="service-name">Service Name *</Label>
                <Input id="service-name" placeholder="Haircut & Style" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="service-desc">Description</Label>
                <Textarea id="service-desc" rows={2} placeholder="Brief description…" {...register('description')} className="resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select defaultValue={editing?.category ?? 'hair'} onValueChange={(v) => setValue('category', v as ServiceCategory)}>
                    <SelectTrigger id="service-category"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="service-duration">Duration (min) *</Label>
                  <Input id="service-duration" type="number" {...register('duration_min')} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="service-price">Price (₱) *</Label>
                <Input id="service-price" type="number" step="0.01" {...register('price')} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('is_active')} className="rounded" id="service-active" defaultChecked />
                <span className="text-sm">Active (visible to customers)</span>
              </label>
              <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update Service' : 'Add Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map(cat => (
            <div key={cat.value}>
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                {cat.emoji} {cat.label}
              </h2>
              {grouped[cat.value].length === 0 ? (
                <p className="text-sm text-muted-foreground">No {cat.label.toLowerCase()} services yet.</p>
              ) : (
                <Card className="border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <colgroup>
                      <col className="w-full" />
                      <col className="w-24" />
                      <col className="w-24" />
                      <col className="w-28" />
                      <col className="w-24" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Duration</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Price</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Status</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {grouped[cat.value].map(service => (
                        <tr key={service.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium">{service.name}</p>
                            {service.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>}
                          </td>
                          <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground">
                            {service.duration_min} min
                          </td>
                          <td className="px-5 py-3 font-semibold text-primary">
                            ₱{service.price.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 hidden md:table-cell">
                            <Badge variant="secondary" className={service.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleActive(service)}
                                id={`toggle-${service.id}`}
                                title={service.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {service.is_active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(service)} id={`edit-${service.id}`}>
                                <Pencil className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deleteService(service.id)} id={`delete-${service.id}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
