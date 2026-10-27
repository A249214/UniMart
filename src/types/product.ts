export type ProductCategory = 
  | 'stationery'
  | 'books'
  | 'tech-accessories'
  | 'bags'
  | 'student-bundles'
  // Backward compatibility alias mappings:
  | 'textbooks'
  | 'backpacks'
  | 'audio'
  | 'chargers'
  | 'study-accessories'

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductReview {
  id: string
  author: string
  university: string
  rating: number
  date: string
  comment: string
}

/**
 * Raw Firestore Product Schema as required:
 * name, description, price, category, imageUrl, stock, isActive, isFeatured, createdAt
 */
export interface FirestoreProduct {
  name: string
  description: string
  price: number
  category: ProductCategory | string
  imageUrl: string
  stock: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  shortDescription?: string
  originalPrice?: number
  categoryLabel?: string
  images?: string[]
  specs?: ProductSpec[]
  tags?: string[]
  sku?: string
  deliveryTimeEstimate?: string
  isBestSeller?: boolean
  isStudentDeal?: boolean
  badge?: string
  rating?: number
  reviewCount?: number
  slug?: string
}

/**
 * Full UI Product Interface
 */
export interface Product {
  id: string
  name: string
  title: string
  slug: string
  price: number
  originalPrice?: number
  category: ProductCategory
  categoryLabel: string
  description: string
  shortDescription: string
  imageUrl: string
  images: string[]
  stock: number
  stockCount: number
  isActive: boolean
  inStock: boolean
  isFeatured: boolean
  featured?: boolean
  rating: number
  reviewCount: number
  isBestSeller?: boolean
  isNewArrival?: boolean
  isStudentDeal?: boolean
  badge?: string
  specs: ProductSpec[]
  tags: string[]
  sku: string
  deliveryTimeEstimate: string
  createdAt: string
}

/**
 * Maps raw Firestore document fields to UI Product format
 */
export function mapFirestoreDocToProduct(id: string, data: any): Product {
  const name = data.name || data.title || 'Untitled Product'
  const imageUrl = data.imageUrl || (Array.isArray(data.images) ? data.images[0] : '')
  const stock = typeof data.stock === 'number' ? data.stock : (typeof data.stockCount === 'number' ? data.stockCount : 10)
  const isActive = typeof data.isActive === 'boolean' ? data.isActive : true
  const isFeatured = typeof data.isFeatured === 'boolean' ? data.isFeatured : Boolean(data.featured)

  return {
    id,
    name,
    title: name,
    slug: data.slug || id,
    price: data.price || 0,
    originalPrice: data.originalPrice,
    category: data.category || 'stationery',
    categoryLabel: data.categoryLabel || 'Campus Gear',
    description: data.description || '',
    shortDescription: data.shortDescription || data.description?.slice(0, 120) || '',
    imageUrl,
    images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [imageUrl],
    stock,
    stockCount: stock,
    isActive,
    inStock: stock > 0 && isActive,
    isFeatured,
    featured: isFeatured,
    rating: data.rating || 4.8,
    reviewCount: data.reviewCount || 10,
    isBestSeller: Boolean(data.isBestSeller),
    isNewArrival: Boolean(data.isNewArrival),
    isStudentDeal: Boolean(data.isStudentDeal),
    badge: data.badge,
    specs: Array.isArray(data.specs) ? data.specs : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    sku: data.sku || `UM-${id.toUpperCase()}`,
    deliveryTimeEstimate: data.deliveryTimeEstimate || '1-2 days to hostel gate',
    createdAt: data.createdAt || new Date().toISOString(),
  }
}
