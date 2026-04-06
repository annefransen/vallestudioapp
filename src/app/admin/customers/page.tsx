'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, UserCircle, Calendar, Phone, Mail, 
  MapPin, Scissors, ChevronDown, CheckCircle2, XCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// MOCK DATA for Phase 1 Design
const MOCK_CUSTOMERS = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    phone: '+63 917 123 4567',
    address: 'Makati City, Metro Manila',
    status: 'active',
    totalVisits: 14,
    totalSpent: 45000,
    lastVisit: '2026-03-15',
    history: [
      { id: 'h1', date: '2026-03-15', service: 'Full Balayage & Cut', type: 'reservation', status: 'completed', price: 6500 },
      { id: 'h2', date: '2026-01-10', service: 'Root Retouch', type: 'walk-in', status: 'completed', price: 2500 }
    ]
  },
  {
    id: 'c2',
    name: 'James Rodriguez',
    email: 'james.rod@example.com',
    phone: '+63 918 987 6543',
    address: 'BGC, Taguig',
    status: 'active',
    totalVisits: 6,
    totalSpent: 8500,
    lastVisit: '2026-04-01',
    history: [
      { id: 'h3', date: '2026-04-01', service: 'Men\'s Fade & Shape', type: 'reservation', status: 'completed', price: 1200 },
      { id: 'h4', date: '2026-03-05', service: 'Men\'s Trim', type: 'reservation', status: 'cancelled', price: 800 }
    ]
  },
  {
    id: 'c3',
    name: 'Elena Gilbert',
    email: 'elena.g@example.com',
    phone: '+63 920 555 1234',
    address: 'Pasig City',
    status: 'inactive',
    totalVisits: 2,
    totalSpent: 3000,
    lastVisit: '2025-11-20',
    history: [
      { id: 'h5', date: '2025-11-20', service: 'Gel Manicure', type: 'walk-in', status: 'completed', price: 1500 }
    ]
  }
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Customer CRM</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            Manage client profiles, histories, and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white dark:bg-[#111118] border-gray-200 dark:border-white/10 rounded-xl"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-gray-200 dark:border-white/10 dark:bg-[#111118]">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="py-20 text-center">
            <UserCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500">No customers found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
          </div>
        ) : (
          filteredCustomers.map((customer, idx) => {
            const isExpanded = expandedId === customer.id

            return (
              <motion.div
                key={customer.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card 
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10 dark:bg-[#1a1a24]' 
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                >
                  <div 
                    className="p-5 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{customer.name}</h3>
                          <Badge variant="outline" className={`px-2 py-0 border ${customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                            {customer.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5" /> {customer.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
                      <div className="hidden lg:block">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Visits</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{customer.totalVisits}</p>
                      </div>
                      <div className="hidden lg:block">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">LTV Spent</p>
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">₱{customer.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Request</p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{customer.lastVisit}</p>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                          <Tabs defaultValue="overview" className="mt-4 w-full">
                            <TabsList className="bg-gray-200/50 dark:bg-white/5 border border-white/5 rounded-xl p-1 h-auto">
                              <TabsTrigger value="overview" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a35] data-[state=active]:shadow-sm">Overview</TabsTrigger>
                              <TabsTrigger value="history" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a35] data-[state=active]:shadow-sm">Booking History</TabsTrigger>
                              <TabsTrigger value="notes" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-[#2a2a35] data-[state=active]:shadow-sm">Stylist Notes</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="overview" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Contact Info</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-indigo-400" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Phone Number</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{customer.phone}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-pink-400" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Address / Neighborhood</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{customer.address}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                   <h4 className="font-semibold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Quick Actions</h4>
                                   <div className="flex gap-3">
                                      <Button variant="outline" className="rounded-xl flex-1 bg-white dark:bg-[#111118]">Message</Button>
                                      <Button className="rounded-xl flex-1 bg-indigo-600 hover:bg-indigo-700">Book Appt</Button>
                                   </div>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="history" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                              <div className="space-y-3">
                                {customer.history.map((record) => (
                                  <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111118]">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${record.type === 'walk-in' ? 'bg-pink-500/10 text-pink-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                        <Scissors className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <p className="font-bold text-gray-900 dark:text-gray-100">{record.service}</p>
                                          <Badge variant="outline" className="px-1.5 py-0 text-[10px] uppercase border font-semibold">{record.type}</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                          <Calendar className="w-3 h-3" /> {record.date} 
                                          <span className="text-gray-300 dark:text-gray-700">•</span>
                                          {record.status === 'completed' ? <CheckCircle2 className="w-3 h-3 text-emerald-500"/> : <XCircle className="w-3 h-3 text-rose-500"/>}
                                          <span className={record.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                            {record.status}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-gray-900 dark:text-white">₱{record.price.toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="notes" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                               <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111118] text-sm text-gray-500">
                                  No clinical or stylistic notes recorded for this client yet.
                               </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

    </div>
  )
}
