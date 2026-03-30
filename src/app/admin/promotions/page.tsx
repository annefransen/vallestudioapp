'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react'
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
import type { Promotion, DiscountType } from '@/types'
import { toast } from 'sonner'

const schema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  description: z.string().optional(),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.coerce.number().min(0.01),
  min_amount: z.coerce.number().min(0).default(0),
  valid_from: z.string().min(1, 'Start date required'),
  valid_to: z.string().min(1, 'End date required'),
  max_uses: z.coerce.number().nullable().optional(),
  is_active: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      discount_type: 'percent',
      is_active: true,
      min_amount: 0,
      valid_from: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const discountType = watch('discount_type')

  const loadPromotions = async () => {
    const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
    setPromotions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadPromotions() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ discount_type: 'percent', is_active: true, min_amount: 0, valid_from: format(new Date(), 'yyyy-MM-dd') })
    setOpen(true)
  }

  const openEdit = (promo: Promotion) => {
    setEditing(promo)
    reset({
      code: promo.code,
      description: promo.description ?? '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_amount: promo.min_amount,
      valid_from: promo.valid_from,
      valid_to: promo.valid_to,
      max_uses: promo.max_uses ?? undefined,
      is_active: promo.is_active,
    })
    setOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    const payload = { ...data, code: data.code.toUpperCase(), max_uses: data.max_uses ?? null }

    if (editing) {
      const { error } = await supabase.from('promotions').update(payload).eq('id', editing.id)
      if (error) { toast.error('Failed to update promo'); setSubmitting(false); return }
      toast.success('Promo updated')
    } else {
      const { error } = await supabase.from('promotions').insert(payload)
      if (error) { toast.error(error.message.includes('unique') ? 'Promo code already exists' : 'Failed to add promo'); setSubmitting(false); return }
      toast.success('Promo added')
    }
    setOpen(false)
    setSubmitting(false)
    loadPromotions()
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Delete this promo code?')) return
    const { error } = await supabase.from('promotions').delete().eq('id', id)
    if (error) { toast.error('Cannot delete promo'); return }
    toast.success('Promo deleted')
    setPromotions(prev => prev.filter(p => p.id !== id))
  }

  const isExpired = (promo: Promotion) => new Date(promo.valid_to) < new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Promotions</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage discount codes and special offers</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="promo-code">Promo Code *</Label>
                <Input id="promo-code" placeholder="SUMMER20" className="uppercase" {...register('code')} />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-desc">Description</Label>
                <Textarea id="promo-desc" rows={2} placeholder="Summer discount…" {...register('description')} className="resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Discount Type *</Label>
                  <Select defaultValue="percent" onValueChange={(v) => setValue('discount_type', v as DiscountType)}>
                    <SelectTrigger id="promo-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed (₱)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="promo-value">{discountType === 'percent' ? 'Discount %' : 'Discount ₱'} *</Label>
                  <Input id="promo-value" type="number" step="0.01" placeholder={discountType === 'percent' ? '20' : '100'} {...register('discount_value')} />
                  {errors.discount_value && <p className="text-xs text-destructive">{errors.discount_value.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-min">Min. Order Amount (₱)</Label>
                <Input id="promo-min" type="number" step="0.01" placeholder="0" {...register('min_amount')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="promo-from">Valid From *</Label>
                  <Input id="promo-from" type="date" {...register('valid_from')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="promo-to">Valid To *</Label>
                  <Input id="promo-to" type="date" {...register('valid_to')} />
                  {errors.valid_to && <p className="text-xs text-destructive">{errors.valid_to.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-max">Max Uses (leave blank for unlimited)</Label>
                <Input id="promo-max" type="number" placeholder="Unlimited" {...register('max_uses')} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('is_active')} defaultChecked className="rounded" id="promo-active" />
                <span className="text-sm">Active</span>
              </label>
              <Button type="submit" className="w-full gradient-brand text-white border-0" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update Promo' : 'Create Promo'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : promotions.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No promo codes yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first discount code.</p>
        </Card>
      ) : (
        <Card className="border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Discount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Validity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Uses</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promotions.map(promo => {
                const expired = isExpired(promo)
                return (
                  <tr key={promo.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono font-bold text-primary">{promo.code}</p>
                      {promo.description && <p className="text-xs text-muted-foreground mt-0.5">{promo.description}</p>}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="font-semibold">
                        {promo.discount_type === 'percent' ? `${promo.discount_value}%` : `₱${promo.discount_value}`} off
                      </p>
                      {promo.min_amount > 0 && (
                        <p className="text-xs text-muted-foreground">Min. ₱{promo.min_amount}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">
                      <p>{format(parseISO(promo.valid_from), 'MMM d')} – {format(parseISO(promo.valid_to), 'MMM d, yyyy')}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground">
                      {promo.uses_count}{promo.max_uses ? `/${promo.max_uses}` : ''}
                    </td>
                    <td className="px-5 py-4">
                      {!promo.is_active ? (
                        <Badge variant="secondary" className="status-cancelled text-xs">Inactive</Badge>
                      ) : expired ? (
                        <Badge variant="secondary" className="status-no_show text-xs">Expired</Badge>
                      ) : (
                        <Badge variant="secondary" className="status-confirmed text-xs">Active</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(promo)} id={`edit-promo-${promo.id}`}>
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deletePromo(promo.id)} id={`delete-promo-${promo.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
