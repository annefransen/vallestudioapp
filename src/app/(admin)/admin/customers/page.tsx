'use client'

import React, { useState } from 'react'
import { Search, UserCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// Data Types
interface CustomerHistory {
  id: string;
  date: string;
  service: string;
  type: string;
  status: string;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  history: CustomerHistory[];
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const [resReq, walkReq] = await Promise.all([
        supabase.from('reservation').select(`
          reservation_id, reservation_date, status, created_at, profile_id, guest_id,
          profiles (first_name, last_name, phone),
          guests (first_name, last_name, contact_number),
          booking_items (*, services(service_name, price)),
          payments (amount, status)
        `),
        supabase.from('walkins').select(`
          walkin_id, reservation_date, status, created_at, full_name, contact_number,
          booking_items (*, services(service_name, price)),
          payments (amount, status)
        `)
      ])

      const customerMap = new Map<string, Customer>()

      const processRecord = (r: Record<string, unknown>, type: string) => {
        const profile = r.profiles as Record<string, any> | undefined
        const guest = r.guests
        
        // Walkin processing relies on direct columns
        let cid, name, phone
        if (type === 'walk-in') {
          cid = `w_${r.walkin_id}`
          name = r.full_name?.trim() || 'Walk-in Customer'
          phone = r.contact_number || 'N/A'
        } else {
          // Skip if no associated user account representation
          if (!profile && !guest) return

          cid = profile ? `p_${r.profile_id}` : `g_${r.guest_id}`
          name = profile ? `${profile.first_name} ${profile.last_name}` : `${guest.first_name} ${guest.last_name}`
          phone = profile?.phone || guest?.contact_number || 'N/A'
        }
        
        const serviceNode = r.booking_items?.[0]?.services
        const serviceName = serviceNode?.service_name || 'Service'
        const price = serviceNode?.price || 0
        const isPaid = r.payments?.some((p: any) => p.status === 'paid')

        const dateStr = r.reservation_date || r.reservation_date || r.created_at

        const historyRecord: CustomerHistory = {
          id: r.reservation_id || r.walkin_id,
          date: dateStr,
          service: serviceName,
          type,
          status: r.status,
          price: price
        }

        if (!customerMap.has(cid)) {
          customerMap.set(cid, {
            id: cid,
            name: name.trim() || 'Undefined',
            email: 'N/A', // Omitted generically unless explicitly available
            phone,
            address: 'Unspecified',
            status: 'active',
            totalVisits: 0,
            totalSpent: 0,
            lastVisit: dateStr,
            history: []
          })
        }

        const c = customerMap.get(cid)!
        c.totalVisits += 1
        if (isPaid) c.totalSpent += price
        if (new Date(dateStr) > new Date(c.lastVisit)) c.lastVisit = dateStr
        c.history.push(historyRecord)
      };

      (resReq.data || []).forEach((r: any) => { processRecord(r, 'reservation') });
      (walkReq.data || []).forEach((r: any) => { processRecord(r, 'walk-in') });

      // Sort history descending per customer
      const finalCustomers = Array.from(customerMap.values()).map(c => ({
        ...c,
        history: c.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }))

      setCustomers(finalCustomers.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()))
      setLoading(false)
    }
    void loadData()
  }, [])

  const registered = customers.filter(c => c.id.startsWith('p_'))
  const guests = customers.filter(c => c.id.startsWith('g_') || c.id.startsWith('w_'))
  const active = customers.filter(c => {
    const last = new Date(c.lastVisit)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return last > thirtyDaysAgo
  })

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Customers</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage client profiles and engagement</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Users', value: active.length, sub: 'Last 30 days', color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Registered Users', value: registered.length, sub: 'Have accounts', color: 'text-blue-600 bg-blue-50' },
          { label: 'Guest Clients', value: guests.length, sub: 'Walk-ins & guests', color: 'text-amber-600 bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-zinc-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-400">{s.label}</p>
              <div className={cn('w-2 h-2 rounded-full', s.color.includes('emerald') ? 'bg-emerald-400' : s.color.includes('blue') ? 'bg-blue-400' : 'bg-amber-400')} />
            </div>
            <p className="text-2xl font-bold text-zinc-900 mt-2">{s.value}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            placeholder="Search clients…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center"><div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /></div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center">
            <UserCircle className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No customers found</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-50/80">
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Visits</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Spent</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Last Visit</th>
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredCustomers.map(customer => {
                const isExpanded = expandedId === customer.id
                return (
                  <React.Fragment key={customer.id}>
                    <tr onClick={() => toggleExpand(customer.id)} className="hover:bg-zinc-50/50 cursor-pointer transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[11px] font-bold text-zinc-600 shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-zinc-900 leading-none">{customer.name}</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5 md:hidden">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-[13px] text-zinc-700">{customer.phone}</p>
                        <p className="text-[11px] text-zinc-400">{customer.email !== 'N/A' ? customer.email : '—'}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] font-semibold text-zinc-900">{customer.totalVisits}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-[13px] font-semibold text-zinc-900">₱{customer.totalSpent.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-zinc-500">{customer.lastVisit?.slice(0, 10) ?? '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-zinc-400 group-hover:text-zinc-700 transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-zinc-50/50 border-t border-zinc-50 p-0">
                          <div className="px-5 py-5 lg:px-12">
                            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Booking History</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                              {customer.history.map(record => (
                                <div key={record.id} className="flex items-center justify-between bg-white border border-zinc-100 rounded-lg px-4 py-3">
                                  <div>
                                    <p className="text-[13px] font-medium text-zinc-900">{record.service}</p>
                                    <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                      <Calendar className="w-3 h-3" /> {record.date?.slice(0, 10)} · <span className="capitalize">{record.type}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[13px] font-bold text-zinc-900">₱{record.price.toLocaleString()}</p>
                                    <span className={cn('text-[10px] font-semibold uppercase', record.status === 'completed' ? 'text-emerald-600' : 'text-zinc-400')}>
                                      {record.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        )}
        <div className="px-5 py-3 border-t border-zinc-50 bg-zinc-50/30">
          <span className="text-[11px] text-zinc-400">Showing {filteredCustomers.length} of {customers.length} customers</span>
        </div>
      </div>
    </div>
  )
}

