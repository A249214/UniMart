import { ProductCategory } from '@/types/product'

export interface CategoryMeta {
  id: ProductCategory
  slug: string
  label: string
  tagline: string
  description: string
  itemCount: number
  icon: string
  bannerImage: string
  accentColor?: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'stationery',
    slug: 'stationery',
    label: 'Stationery',
    tagline: 'Premium paper, technical pens & journals',
    description: 'Campus-tested dot-grid notebooks, archival Japanese gel pens, drafting equipment, and aesthetic highlighters for lecture notes.',
    itemCount: 48,
    icon: 'PenTool',
    bannerImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'books',
    slug: 'books',
    label: 'Books',
    tagline: 'Syllabus-aligned university textbooks',
    description: 'Authentic SI Metric engineering, CS, pre-med, accounting, and social science textbooks used at NUST, FAST, LUMS, IBA, and UET.',
    itemCount: 52,
    icon: 'BookOpen',
    bannerImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tech-accessories',
    slug: 'tech-accessories',
    label: 'Tech Accessories',
    tagline: 'GaN chargers, ANC audio & desk tech',
    description: 'High-speed 65W/100W GaN laptop chargers, loadshedding-proof power banks, active noise cancelling headphones, and foldable stands.',
    itemCount: 36,
    icon: 'Zap',
    bannerImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bags',
    slug: 'bags',
    label: 'Bags',
    tagline: 'Water-resistant commuter laptop packs',
    description: 'Ergonomic 15-17" padded laptop backpacks, heavy-duty canvas daypacks, and commuter totes built for university transit across Pakistan.',
    itemCount: 22,
    icon: 'Briefcase',
    bannerImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'student-bundles',
    slug: 'student-bundles',
    label: 'Student Bundles',
    tagline: 'Curated starter packs & semester savings',
    description: 'All-in-one semester packs for freshman engineers, CS coders, medical undergrads, and hostel residents with up to 25% bundled savings.',
    itemCount: 14,
    icon: 'Package',
    bannerImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
  },
]

/**
 * Normalizes category IDs or legacy aliases
 */
export function normalizeCategory(category: string): ProductCategory | 'all' {
  if (!category || category === 'all') return 'all'
  if (category === 'textbooks') return 'books'
  if (category === 'backpacks') return 'bags'
  if (category === 'audio' || category === 'chargers' || category === 'study-accessories') return 'tech-accessories'
  return category as ProductCategory
}
