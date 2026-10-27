import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react'
import { Product } from '@/types/product'
import { CartItem, CartContextType } from '@/types/cart'
import { useToast } from './ToastContext'
import { useAuth } from './AuthContext'
import { cartService } from '@/services/cartService'
import { isFirebaseConfigured } from '@/services/firebase'

const CartContext = createContext<CartContextType | undefined>(undefined)

const GUEST_CART_STORAGE_KEY = 'unimart_cart_items_v2'
const FREE_DELIVERY_THRESHOLD = 2500
const STANDARD_DELIVERY_FEE = 150

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast()
  const { user, userProfile } = useAuth()
  const activeUserId = user?.uid || userProfile?.uid

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.warn('[UniMart CartContext] Failed to parse cart from localStorage:', e)
    }
    return []
  })

  const isInitialSyncDone = useRef(false)

  // 1. Sync cart with Firestore upon student login
  useEffect(() => {
    let isMounted = true

    async function loadUserCart() {
      if (!activeUserId) {
        isInitialSyncDone.current = true
        return
      }

      try {
        if (isFirebaseConfigured()) {
          const firestoreCart = await cartService.getCartFromFirestore(activeUserId)
          if (!isMounted) return

          if (firestoreCart.length > 0) {
            // Merge with any guest cart items currently in memory
            setCart((prev) => {
              const merged = [...firestoreCart]
              for (const guestItem of prev) {
                const exists = merged.find(
                  (m) =>
                    m.product.id === guestItem.product.id &&
                    m.selectedOption === guestItem.selectedOption
                )
                if (!exists) {
                  merged.push(guestItem)
                }
              }
              return merged
            })
          } else if (cart.length > 0) {
            // First time student logs in with existing guest items: save to Firestore
            await cartService.syncCartToFirestore(activeUserId, cart)
          }
        }
      } catch (err) {
        console.warn('[UniMart CartContext] Error restoring Firestore cart:', err)
      } finally {
        if (isMounted) {
          isInitialSyncDone.current = true
        }
      }
    }

    loadUserCart()

    return () => {
      isMounted = false
    }
  }, [activeUserId])

  // 2. Persist cart to localStorage and Firestore whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.warn('[UniMart CartContext] Failed to save cart to localStorage:', e)
    }

    // Sync to Firestore for authenticated users
    if (activeUserId && isInitialSyncDone.current && isFirebaseConfigured()) {
      const debounceTimer = setTimeout(() => {
        cartService.syncCartToFirestore(activeUserId, cart)
      }, 500)

      return () => clearTimeout(debounceTimer)
    }
  }, [cart, activeUserId])

  /**
   * Add product to cart with strict validation:
   * - Enforce positive integer quantity
   * - Merge identical product additions into single line
   * - Prevent exceeding available inventory stock
   */
  const addToCart = useCallback(
    (product: Product, quantity: number = 1, selectedOption?: string) => {
      // 1. Prevent zero, negative, or non-integer quantities
      const safeQty = Math.max(1, Math.floor(Number(quantity) || 1))
      const maxStock = Math.max(0, product.stockCount ?? product.stock ?? 99)

      if (maxStock <= 0) {
        showToast('Out of Stock', `${product.title} is currently unavailable.`, 'warning')
        return
      }

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id && item.selectedOption === selectedOption
        )

        if (existingIndex > -1) {
          const currentQty = prev[existingIndex].quantity
          if (currentQty >= maxStock) {
            showToast(
              'Stock Limit Reached',
              `Cannot add more. You already have the maximum available stock (${maxStock}) in your cart.`,
              'warning'
            )
            return prev
          }

          const targetQty = Math.min(maxStock, currentQty + safeQty)
          const addedAmount = targetQty - currentQty

          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: targetQty,
          }

          showToast(
            'Cart Updated',
            `Added ${addedAmount} more ${product.title} to your cart (${targetQty} total).`,
            'success'
          )
          return updated
        }

        // New item entry
        const finalQty = Math.min(maxStock, safeQty)
        showToast(
          'Added to Cart',
          `${finalQty}x ${product.title} has been added to your campus cart.`,
          'success'
        )

        return [...prev, { product, quantity: finalQty, selectedOption }]
      })
    },
    [showToast]
  )

  /**
   * Remove product completely from cart and delete from Firestore
   */
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const item = prev.find((i) => i.product.id === productId)
        if (item) {
          showToast('Item Removed', `${item.product.title} was removed from your cart.`, 'info')
        }
        return prev.filter((i) => i.product.id !== productId)
      })

      if (activeUserId && isFirebaseConfigured()) {
        cartService.removeItemFromFirestore(activeUserId, productId)
      }
    },
    [activeUserId, showToast]
  )

  /**
   * Update item quantity with strict integer and stock boundaries:
   * - Removing if quantity <= 0
   * - Flooring non-integers
   * - Clamping to available stock
   */
  const updateQuantity = useCallback(
    (productId: string, rawQuantity: number) => {
      const safeQty = Math.floor(Number(rawQuantity))

      // If zero or negative, remove item
      if (isNaN(safeQty) || safeQty <= 0) {
        removeFromCart(productId)
        return
      }

      setCart((prev) =>
        prev.map((item) => {
          if (item.product.id === productId) {
            const maxStock = Math.max(1, item.product.stockCount ?? item.product.stock ?? 99)
            if (safeQty > maxStock) {
              showToast(
                'Stock Limit Reached',
                `Only ${maxStock} units are currently available for ${item.product.title}.`,
                'warning'
              )
              return { ...item, quantity: maxStock }
            }
            return { ...item, quantity: safeQty }
          }
          return item
        })
      )
    },
    [removeFromCart, showToast]
  )

  /**
   * Clear the entire cart and wipe Firestore subcollection
   */
  const clearCart = useCallback(() => {
    setCart([])
    localStorage.removeItem(GUEST_CART_STORAGE_KEY)
    if (activeUserId && isFirebaseConfigured()) {
      cartService.clearCartInFirestore(activeUserId)
    }
  }, [activeUserId])

  // Real-time calculations
  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart])

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  }, [cart])

  const shippingEstimate = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE
  }, [subtotal])

  const total = useMemo(() => {
    return subtotal + shippingEstimate
  }, [subtotal, shippingEstimate])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingEstimate,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
