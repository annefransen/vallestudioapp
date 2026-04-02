// ============================================================
// Valle Studio Salon — Shared TypeScript Types
// ============================================================

export type UserRole = 'customer' | 'admin'
export type ServiceCategory = 'hair' | 'nails' | 'brows'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type PaymentMethod = 'cash' | 'gcash_instore' | 'gcash_online'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type DiscountType = 'percent' | 'fixed'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Service {
  service_id: string;
  service_name: string;
  description?: string;
  price: number;
  price_type: 'fixed' | 'starting';
  duration: any; // PostgreSQL INTERVAL
  category: string;
  status: 'available' | 'unavailable';
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string
  code: string
  description: string | null
  discount_type: DiscountType
  discount_value: number
  min_amount: number
  valid_from: string
  valid_to: string
  max_uses: number | null
  uses_count: number
  is_active: boolean
  created_at: string
}

export interface Stylist {
  id: string
  name: string
  specialty?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  profile_id?: string | null
  guest_name: string
  guest_phone?: string | null
  guest_email?: string | null
  service_id: string
  stylist_name?: string | null
  stylist_id?: string | null
  booking_date: string
  booking_time: string
  status: BookingStatus
  notes?: string | null
  is_walkin: boolean
  promotion_id?: string | null
  created_at: string
  updated_at?: string
  // Joined fields
  service?: Partial<Service> & { name?: string }
  profile?: Partial<Profile>
  payment?: Partial<Payment>
  promotion?: Partial<Promotion>
  stylist?: Partial<Stylist>
}

export interface Payment {
  id: string
  booking_id?: string
  reservation_id?: string
  walkin_id?: string
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  xendit_invoice_id?: string | null
  xendit_invoice_url?: string | null
  paid_at?: string | null
  created_at: string
  updated_at?: string
}

// Booking wizard state
export interface BookingFormData {
  // Step 1: Service
  service_id: string
  service?: Service
  // Step 2: Schedule
  booking_date: string
  booking_time: string
  stylist_name: string
  stylist_id?: string
  // Step 3: Details
  is_guest: boolean
  guest_name: string
  guest_phone: string
  guest_email: string
  promo_code: string
  notes: string
  // Step 4: Payment
  payment_method: PaymentMethod
}

// Admin analytics
export interface DashboardStats {
  todayBookings: number
  weeklyRevenue: number
  pendingPayments: number
  walkInsToday: number
  completedToday: number
  cancelledToday: number
}
