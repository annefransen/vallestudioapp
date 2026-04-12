'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/Dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  is_active: z.boolean(),
})
type FormData = z.infer<typeof schema>

export default function StaffDirectoryPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, role: 'Hair Stylist' },
  })

  const loadStaff = async () => {
    const { data } = await supabase.from('staff').select('*').order('first_name')
    if (data) {
      setStaff(data.map((s: Record<string, any>) => ({
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

  useEffect(() => { loadStaff() }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    const payload: Record<string, any> = {
      first_name: data.first_name,
      last_name: data.last_name,
      gmail: data.gmail,
      phone: data.phone || null,
      role: data.role,
      status: data.is_active ? 'active' : 'inactive',
    }
    
    if (!editing && !data.password) {
      payload.password = crypto.randomUUID().slice(0, 8)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-bold tracking-tight text-gray-900">Staff Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage salon staff members and credentials</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-[8px] text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white rounded-[16px] border-0 p-6 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-[8px] text-sm outline-none focus:border-gray-400" placeholder="Jane" {...register('first_name')} />
                  {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Last Name *</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-[8px] text-sm outline-none focus:border-gray-400" placeholder="Doe" {...register('last_name')} />
                  {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email (Login) *</label>
                <input className={cn("w-full px-3 py-2 border border-gray-200 rounded-[8px] text-sm outline-none focus:border-gray-400", editing && "bg-gray-50 text-gray-500")} type="email" placeholder="jane@vallestudio.com" {...register('gmail')} disabled={!!editing} />
                {errors.gmail && <p className="text-xs text-red-500">{errors.gmail.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input className="w-full px-3 py-2 border border-gray-200 rounded-[8px] text-sm outline-none focus:border-gray-400" type="password" placeholder={editing ? '••••••••' : 'create password'} {...register('password')} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Role/Specialty *</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-[8px] text-sm outline-none focus:border-gray-400" placeholder="ex: Senior Hair Stylist" {...register('role')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-[8px] text-sm outline-none focus:border-gray-400" placeholder="09XX" {...register('phone')} />
                </div>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" {...register('is_active')} defaultChecked className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Active Account</span>
              </label>
              
              <button type="submit" className="w-full py-2.5 mt-2 bg-gray-900 text-white rounded-[8px] text-sm font-medium hover:bg-gray-800 transition-colors flex justify-center items-center" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update Record' : 'Save Staff Member'}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : staff.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-900">No staff found</p>
            <p className="text-xs text-gray-500 mt-1">Add your team members here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Staff Member</th>
                <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs hidden sm:table-cell">Contact</th>
                <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Role</th>
                <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                <th className="px-5 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-medium">
                        {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.first_name} {member.last_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{member.gmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-gray-600 font-medium">{member.phone || '—'}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{member.role}</td>
                  <td className="px-5 py-4">
                    {member.is_active ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-green-50 text-green-700">Active</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gray-100 text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors" onClick={() => openEdit(member)}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" onClick={() => deleteStaff(member.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
