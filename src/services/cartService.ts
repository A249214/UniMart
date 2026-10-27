import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore'
import { db, COLLECTIONS, isFirebaseConfigured } from './firebase'
import { CartItem } from '@/types/cart'
import { productService } from './productService'

export const cartService = {
  /**
   * Save or sync full cart to user-owned Firestore subcollection:
   * users/{userId}/cartItems/{productId}
   */
  async syncCartToFirestore(userId: string, cartItems: CartItem[]): Promise<void> {
    if (!db || !isFirebaseConfigured() || !userId) return

    try {
      const cartColRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.CART_ITEMS)
      
      // Update/set each item
      for (const item of cartItems) {
        const itemRef = doc(cartColRef, item.product.id)
        await setDoc(itemRef, {
          productId: item.product.id,
          quantity: item.quantity,
          selectedOption: item.selectedOption || null,
          updatedAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.warn('[UniMart CartService] Error syncing cart to Firestore:', error)
    }
  },

  /**
   * Fetch user's cart from Firestore when logging in
   */
  async getCartFromFirestore(userId: string): Promise<CartItem[]> {
    if (!db || !isFirebaseConfigured() || !userId) return []

    try {
      const cartColRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.CART_ITEMS)
      const snapshot = await getDocs(cartColRef)
      if (snapshot.empty) return []

      const items: CartItem[] = []
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data()
        const product = await productService.getProductById(data.productId)
        if (product) {
          items.push({
            product,
            quantity: data.quantity || 1,
            selectedOption: data.selectedOption || undefined,
          })
        }
      }

      return items
    } catch (error) {
      console.warn('[UniMart CartService] Error fetching cart from Firestore:', error)
      return []
    }
  },

  /**
   * Remove a single item from the user's Firestore cart subcollection
   */
  async removeItemFromFirestore(userId: string, productId: string): Promise<void> {
    if (!db || !isFirebaseConfigured() || !userId) return

    try {
      const itemRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.CART_ITEMS, productId)
      await deleteDoc(itemRef)
    } catch (error) {
      console.warn('[UniMart CartService] Error deleting cart item from Firestore:', error)
    }
  },

  /**
   * Delete all cart items from the user's Firestore cart subcollection
   */
  async clearCartInFirestore(userId: string): Promise<void> {
    if (!db || !isFirebaseConfigured() || !userId) return

    try {
      const cartColRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.CART_ITEMS)
      const snapshot = await getDocs(cartColRef)
      const batchPromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref))
      await Promise.all(batchPromises)
    } catch (error) {
      console.warn('[UniMart CartService] Error clearing cart in Firestore:', error)
    }
  },
}
