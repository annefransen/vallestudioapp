'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type PromoCategory = 'hair' | 'nails' | 'brows'

export type AdminPromo = {
  id: string
  name: string
  description: string | null
  category: PromoCategory
  duration_min: number
  price: number
  is_active: boolean
}

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

const CATEGORIES: { value: PromoCategory; label: string; emoji: string }[] = [
  { value: 'hair', label: 'Hair', emoji: '✂️' },
  { value: 'nails', label: 'Nails', emoji: '💅' },
  { value: 'brows', label: 'Brows', emoji: '🪄' },
]

export default function PromosPage() {
  const [promos, setpromos] = useState<AdminPromo[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaError, setSchemaError] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminPromo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { category: 'hair', is_active: true, duration_min: 60 },
  })

  const loadpromos = async () => {
    const { data } = await supabase.from('promos').select('*').order('category')
    if (data && data.length > 0) {
      // Check if price column exists in the first row
      if (!('price' in data[0])) {
        setSchemaError(true)
      }
      const mapped = data.map((s: any) => ({
        id: s.promo_id,
        name: s.name || s.promo_name || "",
        description: s.description,
        category: s.category as PromoCategory,
        duration_min: parseInterval(s.duration),
        price: s.price ? Number(s.price) : 0,
        is_active: s.status === 'available'
      }))
      setpromos(mapped)
    }
    setLoading(false)
  }

  useEffect(() => { loadpromos() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ category: 'hair', is_active: true, duration_min: 60, price: 0 })
    setOpen(true)
  }

  const openEdit = (Promo: AdminPromo) => {
    setEditing(Promo)
    reset({
      name: Promo.name,
      description: Promo.description ?? '',
      category: Promo.category,
      duration_min: Promo.duration_min,
      price: Promo.price,
      is_active: Promo.is_active,
    })
    setOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    
    const dbPayload = {
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      price_type: 'standard',
      duration: formatInterval(data.duration_min),
      status: data.is_active ? 'available' : 'unavailable'
    }

    if (editing) {
      const { error } = await supabase.from('promos').update(dbPayload).eq('promo_id', editing.id)
      if (error) { toast.error('Failed to update Promo'); setSubmitting(false); return }
      toast.success('Promo updated')
    } else {
      const { error } = await supabase.from('promos').insert(dbPayload)
      if (error) { toast.error('Failed to add Promo'); setSubmitting(false); return }
      toast.success('Promo added')
    }
    setOpen(false)
    setSubmitting(false)
    loadpromos()
  }

  const toggleActive = async (promo: AdminPromo) => {
    const newStatus = promo.is_active ? 'unavailable' : 'available'
    const { error } = await supabase
      .from('promos')
      .update({ status: newStatus })
      .eq('promo_id', promo.id)
    if (!error) {
      toast.success(newStatus === 'available' ? 'Promo activated' : 'Promo deactivated')
      setpromos(prev => prev.map(s => s.id === promo.id ? { ...s, is_active: !s.is_active } : s))
    }
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Delete this Promo? This cannot be undone.')) return
    const { error } = await supabase.from('promos').delete().eq('promo_id', id)
    if (error) { toast.error('Cannot delete Promo with existing bookings'); return }
    toast.success('Promo deleted')
    setpromos(prev => prev.filter(s => s.id !== id))
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = promos.filter(s => s.category === cat.value)
    return acc
  }, {} as Record<PromoCategory, AdminPromo[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[clamp(1.25rem,2vw+0.5rem,1.5rem)] font-heading font-bold">Promos</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage salon promos and pricing</p>
        </div>
        {schemaError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-xl animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-amber-100 shrink-0">
                <Plus className="w-4 h-4 text-amber-700 rotate-45" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-900">Database Update Needed</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your promos table is missing the <strong>price</strong> column. To fix this and see prices on the website, please run this SQL in your Supabase dashboard:
                </p>
                <code className="block bg-amber-900/10 p-2 rounded text-[10px] font-mono text-amber-950 mt-2 select-all">
                  ALTER TABLE public.promos ADD COLUMN price NUMERIC DEFAULT 0;
                </code>
              </div>
            </div>
          </div>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-brand text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Promo
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Promo' : 'Add New Promo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="Promo-name">Promo Name *</Label>
                <Input id="Promo-name" placeholder="Haircut & Style" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="Promo-desc">Description</Label>
                <Textarea id="Promo-desc" rows={2} placeholder="Brief description…" {...register('description')} className="resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select defaultValue={editing?.category ?? 'hair'} onValueChange={(v) => setValue('category', v as PromoCategory)}>
                    <SelectTrigger id="Promo-category"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="Promo-duration">Duration (min) *</Label>
                  <Input id="Promo-duration" type="number" {...register('duration_min')} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="Promo-price">Price (₱) *</Label>
                <Input id="Promo-price" type="number" step="0.01" {...register('price')} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('is_active')} className="rounded" id="Promo-active" defaultChecked />
                <span className="text-sm">Active (visible to customers)</span>
              </label>
              <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update Promo' : 'Add Promo'}
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
                <p className="text-sm text-muted-foreground">No {cat.label.toLowerCase()} promos yet.</p>
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
                      {grouped[cat.value].map(Promo => (
                        <tr key={Promo.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium">{Promo.name}</p>
                            {Promo.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{Promo.description}</p>}
                          </td>
                          <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground">
                            {Promo.duration_min} min
                          </td>
                          <td className="px-5 py-3 font-semibold text-primary">
                            ₱{(Promo.price ?? 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 hidden md:table-cell">
                            <Badge variant="secondary" className={Promo.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}>
                              {Promo.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleActive(Promo)}
                                id={`toggle-${Promo.id}`}
                                title={Promo.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {Promo.is_active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(Promo)} id={`edit-${Promo.id}`}>
                                <Pencil className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deletePromo(Promo.id)} id={`delete-${Promo.id}`}>
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
