import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/data/mockProducts'
import { formatPKR } from '@/utils/formatters'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const StudentBundlesSection: React.FC = () => {
  const bundles = MOCK_PRODUCTS.filter((p) => p.category === 'student-bundles')
  const { addToCart } = useCart()
  const sectionRef = useRef<HTMLElement>(null)
  const bundlesGridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(['.bundles-header', '.bundle-showcase-card'], { opacity: 1, y: 0 })
        return
      }

      // ScrollTrigger section header
      gsap.fromTo(
        '.bundles-header',
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

      // Staggered bundle cards entrance
      gsap.fromTo(
        '.bundle-showcase-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bundlesGridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-20 bg-white border-b border-sand-300"
    >
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="bundles-header flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-clay-700 bg-clay-50 px-2.5 py-1 rounded border border-clay-200">
              Curated Semester Packs
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950 mt-2">
              Student Bundles & Kits
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              All-in-one curated packages tailored for engineering freshmen, coding marathons, and hostel night-owls with built-in semester discounts.
            </p>
          </div>

          <Link
            to="/shop?category=student-bundles"
            className="text-xs font-semibold text-forest-900 hover:text-clay-700 flex items-center gap-1.5 transition-colors self-start md:self-auto group"
          >
            <span>View All Bundles</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Bundle Showcase Cards */}
        <div
          ref={bundlesGridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {bundles.map((bundle) => {
            const savings =
              bundle.originalPrice && bundle.originalPrice > bundle.price
                ? bundle.originalPrice - bundle.price
                : 0

            return (
              <div
                key={bundle.id}
                className="bundle-showcase-card bg-sand-50/50 rounded-md border border-sand-300 shadow-subtle hover:shadow-card hover:border-forest-700/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group will-change-transform"
              >
                <div>
                  {/* Image header with savings badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-sand-200 border-b border-sand-200">
                    <ImageWithFallback
                      src={bundle.images[0]}
                      alt={bundle.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {bundle.badge && (
                        <Badge variant="clay" className="font-bold text-xs shadow-xs px-2.5 py-1">
                          {bundle.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Bundle Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700">
                        Semester Bundle
                      </span>
                      <h3 className="font-serif text-base font-bold text-forest-950 mt-0.5 group-hover:text-forest-800 transition-colors">
                        <Link to={`/product/${bundle.id}`}>
                          {bundle.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-sans line-clamp-2">
                        {bundle.shortDescription}
                      </p>
                    </div>

                    {/* Breakdown list of included specs */}
                    <div className="pt-3 border-t border-sand-200/80 space-y-1.5 text-xs">
                      <p className="text-[11px] font-semibold text-forest-950 uppercase tracking-wider">
                        Included in this kit:
                      </p>
                      {bundle.specs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-forest-900/90 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>{spec.label}:</strong> {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing & Add to Cart footer */}
                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-sand-200/80 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-forest-950 font-sans">
                        {formatPKR(bundle.price)}
                      </div>
                      {bundle.originalPrice && (
                        <div className="text-[11px] text-muted-foreground">
                          <span className="line-through">{formatPKR(bundle.originalPrice)}</span>
                          <span className="ml-1 text-emerald-700 font-semibold">Save {formatPKR(savings)}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCart(bundle, 1)}
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5 mr-1" />}
                      className="px-3 py-1.5 text-xs"
                    >
                      Add Bundle
                    </Button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
