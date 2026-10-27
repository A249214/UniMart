import { Product, mapFirestoreDocToProduct } from '@/types/product'
import { SEED_PRODUCTS } from './seedProducts'

/**
 * Isolated Sample Products for UniMart Storefront
 * Mapped directly from the documented Cloud Firestore seed dataset.
 */
export const MOCK_PRODUCTS: Product[] = SEED_PRODUCTS.map((doc) =>
  mapFirestoreDocToProduct(doc.id, doc)
)

export const MOCK_REVIEWS = [
  {
    id: 'rev-01',
    author: 'Hamza Tariq',
    university: 'FAST-NUCES Islamabad (CS)',
    rating: 5,
    date: '2026-09-18',
    comment: 'Got Thomas Calculus delivered to our hostel reception in H-12 within 8 hours. The book is authentic original print, no blurred figures. Saved me a trip to Rawalpindi Urdu Bazaar!',
  },
  {
    id: 'rev-02',
    author: 'Ayesha Siddiqui',
    university: 'NUST SEECS (Software Eng)',
    rating: 5,
    date: '2026-09-24',
    comment: 'The B5 dot-grid notebooks are the best paper quality I have used in Pakistan. Zero bleed-through even with my Pilot G2 pen. UniMart is a blessing for campus life.',
  },
  {
    id: 'rev-03',
    author: 'Bilal Khan',
    university: 'LUMS (SDSB Business)',
    rating: 5,
    date: '2026-10-02',
    comment: 'The Soundcore Space One headphones blocked all PDC cafeteria noise during midterm week. Battery easily lasted 4 days of library marathons.',
  },
  {
    id: 'rev-04',
    author: 'Mahnoor Farooq',
    university: 'IBA Karachi (Economics)',
    rating: 5,
    date: '2026-10-11',
    comment: 'The 65W GaN charger charges my MacBook Air and phone at the same time without overheating. Really well-packaged and arrived safely at Main Campus.',
  },
]
