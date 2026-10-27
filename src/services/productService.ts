import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  limit,
} from 'firebase/firestore'
import { db, COLLECTIONS, isFirebaseConfigured } from './firebase'
import { Product, ProductCategory, mapFirestoreDocToProduct } from '@/types/product'
import { MOCK_PRODUCTS } from '@/data/mockProducts'
import { normalizeCategory } from '@/data/categories'

export interface FilterOptions {
  query?: string
  category?: string
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'discount'
  maxPrice?: number
  inStockOnly?: boolean
  dealType?: 'all' | 'featured' | 'bestseller' | 'deals'
}

/**
 * Product Service for UniMart
 * Reads live data from Cloud Firestore 'products' collection.
 * Gracefully falls back to documented seed data if Firestore is offline or unseeded.
 */
export const productService = {
  /**
   * Fetch all active products from Firestore
   */
  async getAllProducts(): Promise<Product[]> {
    if (db && isFirebaseConfigured()) {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS))
        if (!snapshot.empty) {
          const activeDocs = snapshot.docs.filter((d) => d.data().isActive !== false)
          if (activeDocs.length > 0) {
            return activeDocs.map((docSnap) =>
              mapFirestoreDocToProduct(docSnap.id, docSnap.data())
            )
          }
        }
      } catch (err) {
        console.warn(
          '[UniMart Firestore] Failed to query live products, falling back to local dataset.',
          err
        )
      }
    }

    return Promise.resolve([...MOCK_PRODUCTS])
  },

  /**
   * Fetch product by ID from Firestore
   */
  async getProductById(id: string): Promise<Product | undefined> {
    if (db && isFirebaseConfigured()) {
      try {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return mapFirestoreDocToProduct(docSnap.id, docSnap.data())
        }

        // Also attempt query by slug
        const slugQuery = query(
          collection(db, COLLECTIONS.PRODUCTS),
          where('slug', '==', id),
          limit(1)
        )
        const slugSnap = await getDocs(slugQuery)
        if (!slugSnap.empty) {
          const first = slugSnap.docs[0]
          return mapFirestoreDocToProduct(first.id, first.data())
        }
      } catch (err) {
        console.warn('[UniMart Firestore] Error fetching product by ID:', err)
      }
    }

    // Local fallback
    const product = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id)
    return Promise.resolve(product)
  },

  /**
   * Fetch product by slug from Firestore
   */
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return this.getProductById(slug)
  },

  /**
   * Fetch featured products for homepage
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const all = await this.getAllProducts()
    return all.filter((p) => p.featured || p.isFeatured)
  },

  /**
   * Fetch best selling items
   */
  async getBestSellers(): Promise<Product[]> {
    const all = await this.getAllProducts()
    return all.filter((p) => p.isBestSeller)
  },

  /**
   * Fetch student deals & bundles
   */
  async getStudentDeals(): Promise<Product[]> {
    const all = await this.getAllProducts()
    return all.filter(
      (p) => p.isStudentDeal || (p.originalPrice && p.originalPrice > p.price)
    )
  },

  /**
   * Fetch products by category
   */
  async getProductsByCategory(category: ProductCategory | string): Promise<Product[]> {
    const normalized = normalizeCategory(category)
    const all = await this.getAllProducts()
    if (normalized === 'all') return all
    return all.filter((p) => p.category === normalized)
  },

  /**
   * Query & filter products with sorting and availability
   */
  async filterProducts({
    query = '',
    category,
    sortBy = 'featured',
    maxPrice,
    inStockOnly = false,
    dealType = 'all',
  }: FilterOptions): Promise<Product[]> {
    let result = await this.getAllProducts()

    // Category filter with alias normalization
    if (category && category !== 'all') {
      const normalized = normalizeCategory(category)
      result = result.filter((p) => p.category === normalized)
    }

    // Deals / Tab filter
    if (dealType === 'featured') {
      result = result.filter((p) => p.featured || p.isFeatured)
    } else if (dealType === 'bestseller') {
      result = result.filter((p) => p.isBestSeller)
    } else if (dealType === 'deals') {
      result = result.filter(
        (p) => p.isStudentDeal || (p.originalPrice && p.originalPrice > p.price)
      )
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockCount > 0)
    }

    // Search query filter
    if (query.trim()) {
      const q = query.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Price filter
    if (maxPrice !== undefined && maxPrice > 0) {
      result = result.filter((p) => p.price <= maxPrice)
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'discount':
        result.sort((a, b) => {
          const discountA = a.originalPrice ? a.originalPrice - a.price : 0
          const discountB = b.originalPrice ? b.originalPrice - b.price : 0
          return discountB - discountA
        })
        break
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0))
        break
      case 'featured':
      default:
        result.sort((a, b) => ((b.featured || b.isFeatured) ? 1 : 0) - ((a.featured || a.isFeatured) ? 1 : 0))
        break
    }

    return result
  },
}
