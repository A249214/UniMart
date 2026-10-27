export type OrderStatus = 'processing' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface CampusAddress {
  university: string
  campus: string
  hostelOrDepartment: string
  roomOrDesk: string
  city: string
  contactPhone: string
  studentId: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  shippingAddress: CampusAddress
  paymentMethod: string
  estimatedDelivery: string
  createdAt?: string
}
