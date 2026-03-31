'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import type { Stylist } from '@/types'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  specialty: z.string().optional(),
  is_active: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Stylist | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { is_active: true },
  })

  const loadStylists = async () => {
    const { data } = await supabase.from('stylists').select('*').order('name')
    setStylists(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadStylists() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ name: '', specialty: '', is_active: true })
    setOpen(true)
  }

  const openEdit = (stylist: Stylist) => {
    setEditing(stylist)
    reset({
      name: stylist.name,
      specialty: stylist.specialty ?? '',
      is_active: stylist.is_active,
    })
    setOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    if (editing) {
      const { error } = await supabase.from('stylists').update(data).eq('id', editing.id)
      if (error) { toast.error('Failed to update stylist'); setSubmitting(false); return }
      toast.success('Stylist updated')
    } else {
      const { error } = await supabase.from('stylists').insert(data)
      if (error) { toast.error('Failed to add stylist'); setSubmitting(false); return }
      toast.success('Stylist added')
    }
    setOpen(false)
    setSubmitting(false)
    loadStylists()
  }

  const deleteStylist = async (id: string) => {
    if (!confirm('Are you sure you want to remove this stylist?')) return
    const { error } = await supabase.from('stylists').delete().eq('id', id)
    if (error) {
      toast.error('Cannot remove stylist (they may be tied to existing bookings)')
      return
    }
    toast.success('Stylist removed')
    setStylists(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Stylists</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage salon staff profiles and specializations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gradient-brand text-white border-0" onClick={openAdd} id="add-stylist-btn">
            <Plus className="w-4 h-4 mr-2" />
            Add Stylist
          </Button>} />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Stylist' : 'Add Stylist'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Full Name *</Label>
                <Input id="s-name" placeholder="Jane Doe" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-spec">Specialty (Optional)</Label>
                <Input id="s-spec" placeholder="ex: Senior Hair Stylist" {...register('specialty')} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" {...register('is_active')} defaultChecked className="rounded" />
                <span className="text-sm font-medium">Available for Booking</span>
              </label>
              <Button type="submit" className="w-full gradient-brand text-white border-0 mt-4" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update Stylist' : 'Save Stylist'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : stylists.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No stylists found</p>
          <p className="text-sm text-muted-foreground mt-1">Add your staff to enable specific scheduling.</p>
        </Card>
      ) : (
        <Card className="border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Stylist</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Specialty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stylists.map(stylist => (
                <tr key={stylist.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 font-medium">{stylist.name}</td>
                  <td className="px-5 py-4 hidden sm:table-cell text-muted-foreground">{stylist.specialty || '—'}</td>
                  <td className="px-5 py-4">
                    {stylist.is_active ? (
                      <Badge variant="secondary" className="status-confirmed text-xs">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="status-cancelled text-xs">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(stylist)}>
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deleteStylist(stylist.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            {stylists.length} staff members
          </div>
        </Card>
      )}
    </div>
  )
}
