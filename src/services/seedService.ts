import { doc, setDoc, getDocs, collection, query, limit } from 'firebase/firestore'
import { db, COLLECTIONS, isFirebaseConfigured } from './firebase'
import { SEED_PRODUCTS } from '@/data/seedProducts'

export interface SeedResult {
  success: boolean
  count: number
  message: string
  skipped?: boolean
}

/**
 * Seeds sample products into the Cloud Firestore 'products' collection.
 * Uses document ID matching (e.g. 'prod-bk-01') to avoid duplicate records.
 */
export async function seedProductsToFirestore(force: boolean = false): Promise<SeedResult> {
  if (!db) {
    return {
      success: false,
      count: 0,
      message: 'Firestore is not initialized. Check your Firebase environment variables.',
    }
  }

  try {
    // Check if already seeded (unless force is true)
    if (!force) {
      const existingQuery = query(collection(db, COLLECTIONS.PRODUCTS), limit(1))
      const snapshot = await getDocs(existingQuery).catch(() => null)
      if (snapshot && !snapshot.empty) {
        return {
          success: true,
          count: snapshot.size,
          skipped: true,
          message: 'Firestore products collection already contains data. Skipped seed.',
        }
      }
    }

    let seededCount = 0

    for (const item of SEED_PRODUCTS) {
      const { id, ...data } = item
      const productRef = doc(db, COLLECTIONS.PRODUCTS, id)

      // Ensure required schema fields are present
      const firestoreData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        stock: data.stock,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        createdAt: data.createdAt,
        // UI & filtering metadata:
        slug: data.slug,
        shortDescription: data.shortDescription,
        originalPrice: data.originalPrice,
        categoryLabel: data.categoryLabel,
        images: data.images,
        rating: data.rating,
        reviewCount: data.reviewCount,
        isBestSeller: data.isBestSeller || false,
        isStudentDeal: data.isStudentDeal || false,
        badge: data.badge || null,
        specs: data.specs,
        tags: data.tags,
        sku: data.sku,
        deliveryTimeEstimate: data.deliveryTimeEstimate,
        updatedAt: new Date().toISOString(),
      }

      await setDoc(productRef, firestoreData, { merge: true })
      seededCount++
    }

    return {
      success: true,
      count: seededCount,
      message: `Successfully seeded ${seededCount} sample products into Cloud Firestore.`,
    }
  } catch (error: any) {
    console.error('[Firestore Seed Error]', error)
    return {
      success: false,
      count: 0,
      message: `Failed to seed Firestore: ${error.message || error}`,
    }
  }
}
