import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db, COLLECTIONS, isFirebaseConfigured } from './firebase'
import { Order } from '@/types/order'
import { trustedOrderBackend, CreateOrderPayload } from './trustedOrderBackend'

export const orderService = {
  /**
   * Create an authoritative verified order via the trusted backend engine
   */
  async createVerifiedOrder(payload: CreateOrderPayload): Promise<Order> {
    return trustedOrderBackend.createVerifiedOrder(payload)
  },

  /**
   * Save a new campus order to Firestore 'orders' collection
   */
  async createOrder(orderData: Omit<Order, 'id'>, userId?: string): Promise<Order> {
    const orderId = `ord-${Date.now()}`
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      userId: userId || undefined,
      createdAt: new Date().toISOString(),
    }

    if (db && isFirebaseConfigured()) {
      try {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId)
        await setDoc(orderRef, newOrder)
        return newOrder
      } catch (error) {
        console.warn('[UniMart OrderService] Error writing order to Firestore:', error)
      }
    }

    // Persist in localStorage for offline session continuity
    try {
      const stored = localStorage.getItem('unimart_user_orders')
      const orders: Order[] = stored ? JSON.parse(stored) : []
      orders.unshift(newOrder)
      localStorage.setItem('unimart_user_orders', JSON.stringify(orders))
    } catch (e) {
      console.warn('Could not save order to local storage', e)
    }

    return newOrder
  },

  /**
   * Fetch all orders placed by a specific user
   */
  async getUserOrders(userId?: string): Promise<Order[]> {
    if (db && isFirebaseConfigured() && userId) {
      try {
        const q = query(
          collection(db, COLLECTIONS.ORDERS),
          where('userId', '==', userId)
        )
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const orders = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Order[]
          orders.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          )
          return orders
        }
      } catch (error) {
        console.warn('[UniMart OrderService] Error querying orders from Firestore:', error)
      }
    }

    // Retrieve from local storage if available
    try {
      const stored = localStorage.getItem('unimart_user_orders')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      // ignore
    }

    return []
  },

  /**
   * Fetch specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    if (db && isFirebaseConfigured()) {
      try {
        const docRef = doc(db, COLLECTIONS.ORDERS, orderId)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Order
        }
      } catch (error) {
        console.warn('[UniMart OrderService] Error fetching order:', error)
      }
    }

    return null
  },
}
