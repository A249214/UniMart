import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, PenTool, Briefcase, Zap, Package } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const CategoryGrid: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  const iconMap: Record<string, React.ReactNode> = {
    stationery: <PenTool className="w-5 h-5 text-forest-800" />,
    books: <BookOpen className="w-5 h-5 text-forest-800" />,
    'tech-accessories': <Zap className="w-5 h-5 text-forest-800" />,
    bags: <Briefcase className="w-5 h-5 text-forest-800" />,
    'student-bundles': <Package className="w-5 h-5 text-forest-800" />,
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(['.category-header', '.category-card'], { opacity: 1, y: 0 })
        return
      }

      // ScrollTrigger section header reveal
      gsap.fromTo(
        '.category-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // Staggered category cards entrance
      gsap.fromTo(
        '.category-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.category-card-grid',
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
      id="categories"
      ref={sectionRef}
      className="py-14 sm:py-20 bg-white border-b border-sand-300"
    >
      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <div className="category-header flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-clay-700 bg-clay-50 px-2.5 py-1 rounded border border-clay-200">
              Department & Semester Gear
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950 mt-2">
              Browse by Campus Need
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Equip your study desk, lecture hall seat, and hostel room with verified supplies tested by Pakistani university students.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs font-semibold text-forest-900 hover:text-clay-700 flex items-center gap-1.5 transition-colors self-start md:self-auto group"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5 Category Cards Grid */}
        <div className="category-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="category-card group relative rounded-md border border-sand-300 bg-sand-50/50 hover:bg-white hover:border-forest-700/60 hover:shadow-card hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between will-change-transform"
            >
              {/* Category visual banner */}
              <div className="h-44 overflow-hidden relative border-b border-sand-200 bg-sand-200">
                <ImageWithFallback
                  src={cat.bannerImage}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-sand-200 block truncate">
                    {cat.tagline}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    {cat.label}
                  </h3>
                </div>
              </div>

              {/* Description and Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
                <div className="pt-3 border-t border-sand-200/80 flex items-center justify-between text-xs font-semibold text-forest-900 group-hover:text-clay-600 transition-colors">
                  <span className="flex items-center gap-1.5">
                    {iconMap[cat.id]}
                    <span>Explore ({cat.itemCount}+)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
