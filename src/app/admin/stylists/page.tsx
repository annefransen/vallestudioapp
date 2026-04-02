'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type StaffMember = {
  id: string
  first_name: string
  last_name: string
  gmail: string
  phone: string | null
  role: string
  is_active: boolean
}

const schema = z.object({
  first_name: z.string().min(2, 'Required'),
  last_name: z.string().min(2, 'Required'),
  gmail: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.string().min(2, 'Required'),
  is_active: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

export default function StylistsPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { is_active: true, role: 'Hair Stylist' },
  })

  const loadStaff = async () => {
    const { data } = await supabase.from('staff').select('*').order('first_name')
    if (data) {
      setStaff(data.map((s: any) => ({
        id: s.staff_id,
        first_name: s.first_name,
        last_name: s.last_name,
        gmail: s.gmail,
        phone: s.phone,
        role: s.role,
        is_active: s.status === 'active'
      })))
    }
    setLoading(false)
  }

  useEffect(() => { loadStaff() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ first_name: '', last_name: '', gmail: '', password: '', phone: '', role: 'Hair Stylist', is_active: true })
    setOpen(true)
  }

  const openEdit = (member: StaffMember) => {
    setEditing(member)
    reset({
      first_name: member.first_name,
      last_name: member.last_name,
      gmail: member.gmail,
      phone: member.phone || '',
      role: member.role,
      password: '', // blank meaning no change
      is_active: member.is_active,
    })
    setOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    const payload: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      gmail: data.gmail,
      phone: data.phone || null,
      role: data.role,
      status: data.is_active ? 'active' : 'inactive',
    }
    
    // Auto-generate password if new and not provided
    if (!editing && !data.password) {
      payload.password = Math.random().toString(36).slice(-8)
    } else if (data.password) {
      payload.password = data.password
    }

    if (editing) {
      const { error } = await supabase.from('staff').update(payload).eq('staff_id', editing.id)
      if (error) { toast.error('Failed to update staff member'); setSubmitting(false); return }
      toast.success('Staff member updated')
    } else {
      const { error } = await supabase.from('staff').insert(payload)
      if (error) { toast.error(error.message.includes('unique') ? 'Email already used' : 'Failed to add staff'); setSubmitting(false); return }
      toast.success('Staff member added')
    }
    setOpen(false)
    setSubmitting(false)
    loadStaff()
  }

  const deleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return
    const { error } = await supabase.from('staff').delete().eq('staff_id', id)
    if (error) {
      toast.error('Cannot remove staff member tied to records')
      return
    }
    toast.success('Staff member removed')
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Staff Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage salon staff members and credentials</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-brand text-white border-0" onClick={openAdd} id="add-stylist-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="s-first">First Name *</Label>
                  <Input id="s-first" placeholder="Jane" {...register('first_name')} />
                  {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-last">Last Name *</Label>
                  <Input id="s-last" placeholder="Doe" {...register('last_name')} />
                  {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="s-email">Email (Login) *</Label>
                <Input id="s-email" type="email" placeholder="jane@vallestudio.com" {...register('gmail')} disabled={!!editing} className={editing ? "bg-muted" : ""}  />
                {errors.gmail && <p className="text-xs text-destructive">{errors.gmail.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-pass">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</Label>
                <Input id="s-pass" type="password" placeholder={editing ? '••••••••' : 'create password'} {...register('password')} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="s-role">Role/Specialty *</Label>
                  <Input id="s-role" placeholder="ex: Senior Hair Stylist" {...register('role')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-phone">Phone</Label>
                  <Input id="s-phone" placeholder="09XX" {...register('phone')} />
                </div>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" {...register('is_active')} defaultChecked className="rounded border-border" />
                <span className="text-sm font-medium">Active Account</span>
              </label>
              
              <Button type="submit" className="w-full gradient-brand text-white border-0 mt-4" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update Record' : 'Save Staff Member'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : staff.length === 0 ? (
        <Card className="border-border/50 p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold">No staff found</p>
          <p className="text-sm text-muted-foreground mt-1">Add your team members here.</p>
        </Card>
      ) : (
        <Card className="border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Staff Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    <p className="text-xs text-muted-foreground">{member.gmail}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-muted-foreground">{member.phone || '—'}</td>
                  <td className="px-5 py-4 text-primary font-medium">{member.role}</td>
                  <td className="px-5 py-4">
                    {member.is_active ? (
                      <Badge variant="secondary" className="status-confirmed text-xs">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="status-cancelled text-xs">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(member)}>
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deleteStaff(member.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            {staff.length} team members
          </div>
        </Card>
      )}
    </div>
  )
}
