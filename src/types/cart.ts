import { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
  selectedOption?: string
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  shippingEstimate: number
  total: number
}
