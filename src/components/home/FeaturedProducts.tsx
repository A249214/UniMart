import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Flame, Percent } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/data/mockProducts'
import { ProductCard } from '@/components/shop/ProductCard'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const FeaturedProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'bestseller' | 'deals'>('featured')
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestseller':
        return MOCK_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8)
      case 'deals':
        return MOCK_PRODUCTS.filter((p) => p.isStudentDeal || (p.originalPrice && p.originalPrice > p.price)).slice(0, 8)
      case 'featured':
      default:
        return MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 8)
    }
  }

  const products = getFilteredProducts()

  // 1. Initial ScrollTrigger Section Entrance
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(['.featured-header', '.featured-product-card'], { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        '.featured-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '.featured-product-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  // 2. Fluid tab transition animation
  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.fromTo(
        gridRef.current,
        { opacity: 0.4, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      )
    },
    { scope: sectionRef, dependencies: [activeTab] }
  )

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-20 bg-sand-50/60 border-b border-sand-300"
    >
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="featured-header flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-clay-500" />
              <span>Campus Curations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
              Essential Student Favorites
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Handpicked textbooks, noise-cancelling headphones, high-output chargers, and notebooks with verified campus reviews.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center p-1 bg-sand-200/60 rounded-md border border-sand-300 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('featured')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:text-forest-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:text-forest-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Sellers</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deals')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                activeTab === 'deals'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:text-forest-950'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-clay-400" />
              <span>Student Deals</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {products.map((product) => (
            <div key={product.id} className="featured-product-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom Catalog Link */}
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-white hover:bg-sand-100 text-forest-900 border border-sand-300 text-xs font-semibold shadow-subtle hover:-translate-y-0.5 transition-all group"
          >
            <span>Explore All {MOCK_PRODUCTS.length} Campus Items</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
