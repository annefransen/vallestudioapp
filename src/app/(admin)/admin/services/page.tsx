'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/Dialog'
import { createClient } from '@/lib/supabase/client'
import type { ServiceCategory } from '@/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function parseInterval(intervalStr: string) {
  if (!intervalStr) return 0
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
  category: z.enum(['Hair', 'Nails', 'Brow']),
  duration_min: z.coerce.number().min(15).max(480),
  price: z.coerce.number().min(1),
  is_active: z.boolean(),
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

const CATEGORIES: { value: string; label: string; emoji: string }[] = [
  { value: 'Hair', label: 'Hair', emoji: '✂️' },
  { value: 'Nails', label: 'Nails', emoji: '💅' },
  { value: 'Brow', label: 'Brows', emoji: '🪄' },
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'services'|'promos'>('services')
  const [services, setServices] = useState<AdminService[]>([])
  const [promos, setPromos] = useState<AdminService[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminService | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { category: 'Hair', is_active: true, duration_min: 60 },
  })

  const loadData = async () => {
    setLoading(true)
    const [svcRes, promoRes] = await Promise.all([
      supabase.from('services').select('*').order('category').order('price'),
      supabase.from('promos').select('*').order('category').order('price')
    ])

    if (svcRes.data) {
      const mapped = svcRes.data.map((s: Record<string, unknown>) => ({
        id: s.service_id as string,
        name: s.service_name as string,
        description: (s.description as string) || null,
        category: s.category as ServiceCategory,
        duration_min: parseInterval(s.duration as string),
        price: Number(s.price),
        is_active: s.status === 'available'
      }))
      setServices(mapped)
    }

    if (promoRes.data) {
      const mapped = promoRes.data.map((s: Record<string, unknown>) => ({
        id: s.promo_id as string,
        name: s.name as string,
        description: (s.description as string) || null,
        category: s.category as ServiceCategory,
        duration_min: parseInterval(s.duration as string),
        price: Number(s.price),
        is_active: s.status === 'active'
      }))
      setPromos(mapped)
    }
    setLoading(false)
  }

  useEffect(() => { void loadData() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ category: 'Hair', is_active: true, duration_min: 60, price: 0 })
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
    const table = activeTab === 'services' ? 'services' : 'promos'
    const idField = activeTab === 'services' ? 'service_id' : 'promo_id'
    
    const dbPayload = activeTab === 'services' ? {
      service_name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      price_type: 'standard',
      duration: formatInterval(data.duration_min),
      status: data.is_active ? 'available' : 'unavailable'
    } : {
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      duration: formatInterval(data.duration_min),
      status: data.is_active ? 'active' : 'inactive'
    }

    if (editing) {
      const { error } = await supabase.from(table).update(dbPayload as any).eq(idField, editing.id)
      if (error) { toast.error(`Failed to update ${activeTab === 'services' ? 'service' : 'promo'}`); setSubmitting(false); return }
      toast.success(`${activeTab === 'services' ? 'Service' : 'Promo'} updated`)
    } else {
      const { error } = await supabase.from(table).insert(dbPayload as any)
      if (error) { toast.error(`Failed to add ${activeTab === 'services' ? 'service' : 'promo'}`); setSubmitting(false); return }
      toast.success(`${activeTab === 'services' ? 'Service' : 'Promo'} added`)
    }
    setOpen(false)
    setSubmitting(false)
    loadData()
  }

  const toggleActive = async (service: AdminService) => {
    const newStatus = service.is_active ? 'unavailable' : 'available'
    const { error } = await supabase.from('services').update({ status: newStatus }).eq('service_id', service.id)
    if (!error) {
      toast.success(newStatus === 'available' ? 'Service activated' : 'Service deactivated')
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s))
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm(`Delete this ${activeTab === 'services' ? 'service' : 'promo'}? This cannot be undone.`)) return
    const table = activeTab === 'services' ? 'services' : 'promos'
    const idField = activeTab === 'services' ? 'service_id' : 'promo_id'

    const { error } = await supabase.from(table).delete().eq(idField, id)
    if (error) { toast.error(`Cannot delete ${activeTab === 'services' ? 'service' : 'promo'} with existing records`); return }
    toast.success(`${activeTab === 'services' ? 'Service' : 'Promo'} deleted`)
    if (activeTab === 'services') {
      setServices(prev => prev.filter(s => s.id !== id))
    } else {
      setPromos(prev => prev.filter(s => s.id !== id))
    }
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = services.filter(s => s.category === cat.value)
    return acc
  }, {} as Record<string, AdminService[]>)

  const groupedPromos = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = promos.filter(s => s.category === cat.value)
    return acc
  }, {} as Record<string, AdminService[]>)



  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Services & Promos</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage salon offerings, pricing, and promotions</p>
        </div>
        {/* Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-lg gap-0.5">
          {(['services', 'promos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn('px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize',
                activeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'services' && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                onClick={openAdd}
                className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Service
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editing ? `Edit ${activeTab === 'services' ? 'Service' : 'Promo'}` : `Add New ${activeTab === 'services' ? 'Service' : 'Promo'}`}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">{activeTab === 'services' ? 'Service' : 'Promo'} Name *</label>
                    <input className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400" placeholder={activeTab === 'services' ? "Haircut & Style" : "Full treatment bundle"} {...register('name')} />
                    {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Description</label>
                    <textarea rows={2} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400 resize-none" placeholder="Brief description…" {...register('description')} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Category *</label>
                      <select className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white outline-none" {...register('category')}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Duration (min) *</label>
                      <input type="number" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none" {...register('duration_min')} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Price (₱) *</label>
                    <input type="number" step="0.01" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none" {...register('price')} />
                    {errors.price && <p className="text-[11px] text-red-500">{errors.price.message}</p>}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('is_active')} className="rounded border-zinc-300" defaultChecked />
                    <span className="text-sm text-zinc-700">Active (visible to customers)</span>
                  </label>
                  <button type="submit" disabled={submitting} className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editing ? `Update ${activeTab === 'services' ? 'Service' : 'Promo'}` : `Save ${activeTab === 'services' ? 'Service' : 'Promo'}`}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
          ) : (
            <div className="space-y-5">
              {CATEGORIES.map(cat => (
                <div key={cat.value} className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
                  <div className="bg-zinc-50/80 px-5 py-3 border-b border-zinc-100 flex items-center justify-between">
                    <h2 className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <span>{cat.emoji}</span> {cat.label}
                    </h2>
                    <span className="text-[11px] text-zinc-400">{grouped[cat.value].length} services</span>
                  </div>
                  {grouped[cat.value].length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-400">No {cat.label.toLowerCase()} services yet.</div>
                  ) : (
                    <div className="divide-y divide-zinc-50">
                      {grouped[cat.value].map(service => (
                        <div key={service.id} className="flex items-center px-5 py-3.5 hover:bg-zinc-50/50 transition-colors group">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <p className="text-[13px] font-semibold text-zinc-900">{service.name}</p>
                              <span className={cn('text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded',
                                service.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'
                              )}>
                                {service.is_active ? 'Active' : 'Hidden'}
                              </span>
                            </div>
                            {service.description && <p className="text-[11px] text-zinc-400 mt-0.5 truncate max-w-md">{service.description}</p>}
                          </div>
                          <div className="flex items-center gap-6 ml-4 shrink-0">
                            <span className="text-[12px] text-zinc-500">{service.duration_min} min</span>
                            <span className="text-[13px] font-bold text-zinc-900 w-20 text-right">₱{service.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => toggleActive(service)} className="p-1.5 text-zinc-400 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50" title={service.is_active ? 'Deactivate' : 'Activate'}>
                                {service.is_active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              <button onClick={() => openEdit(service)} className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-100">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteItem(service.id)} className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'promos' && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                onClick={openAdd}
                className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Promo
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editing ? 'Edit Promo' : 'Add Promo'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Promo Name *</label>
                    <input className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400" placeholder="Promo Bundle" {...register('name')} />
                    {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Description</label>
                    <textarea rows={2} className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400 resize-none" placeholder="Brief description…" {...register('description')} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Category *</label>
                      <select className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white outline-none" {...register('category')}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Duration (min) *</label>
                      <input type="number" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none" {...register('duration_min')} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Price (₱) *</label>
                    <input type="number" step="0.01" className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none" {...register('price')} />
                    {errors.price && <p className="text-[11px] text-red-500">{errors.price.message}</p>}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('is_active')} className="rounded border-zinc-300" defaultChecked />
                    <span className="text-sm text-zinc-700">Active (visible to customers)</span>
                  </label>
                  <button type="submit" disabled={submitting} className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {editing ? 'Update Promo' : 'Save Promo'}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
          ) : (
            <div className="space-y-5">
              {CATEGORIES.map(cat => (
                <div key={cat.value} className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
                  <div className="bg-zinc-50/80 px-5 py-3 border-b border-zinc-100 flex items-center justify-between">
                    <h2 className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <span>{cat.emoji}</span> {cat.label}
                    </h2>
                    <span className="text-[11px] text-zinc-400">{groupedPromos[cat.value].length} promos</span>
                  </div>
                  {groupedPromos[cat.value].length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-400">No {cat.label.toLowerCase()} promos yet.</div>
                  ) : (
                    <div className="divide-y divide-zinc-50">
                      {groupedPromos[cat.value].map(promo => (
                        <div key={promo.id} className="flex items-center px-5 py-3.5 hover:bg-zinc-50/50 transition-colors group">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <p className="text-[13px] font-semibold text-zinc-900">{promo.name}</p>
                              <span className={cn('text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded',
                                promo.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'
                              )}>
                                {promo.is_active ? 'Active' : 'Hidden'}
                              </span>
                            </div>
                            {promo.description && <p className="text-[11px] text-zinc-400 mt-0.5 truncate max-w-md">{promo.description}</p>}
                          </div>
                          <div className="flex items-center gap-6 ml-4 shrink-0">
                            <span className="text-[12px] text-zinc-500">{promo.duration_min} min</span>
                            <span className="text-[13px] font-bold text-zinc-900 w-20 text-right">₱{promo.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(promo)} className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-100">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteItem(promo.id)} className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
