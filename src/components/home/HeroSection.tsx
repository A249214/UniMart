import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useCampus } from '@/context/CampusContext'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const HeroSection: React.FC = () => {
  const { currentCampus } = useCampus()
  const heroRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const hubsRef = useRef<HTMLParagraphElement>(null)
  const genuineRef = useRef<HTMLParagraphElement>(null)
  const expressRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      // Respect accessibility preference: skip motion if user requested reduced motion
      if (prefersReducedMotion()) {
        gsap.set(
          [
            '.hero-badge',
            '.hero-title',
            '.hero-subtitle',
            '.hero-ctas',
            '.hero-stat',
            imageWrapRef.current,
            '.hero-floating-card',
          ],
          { opacity: 1, y: 0, scale: 1 }
        )
        return
      }

      // 1. Staggered Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.hero-title',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.35'
        )
        .fromTo(
          '.hero-subtitle',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.45'
        )
        .fromTo(
          '.hero-ctas',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          imageWrapRef.current,
          { opacity: 0, scale: 0.94, y: 32 },
          { opacity: 1, scale: 1, y: 0, duration: 0.95 },
          '-=0.65'
        )
        .fromTo(
          '.hero-floating-card',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.35'
        )
        .fromTo(
          '.hero-stat',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
          '-=0.3'
        )

      // 2. Animated Count-up for Valid Displayed Campus Statistics
      const statsObj = { hubs: 0, genuine: 0 }
      gsap.to(statsObj, {
        hubs: 12,
        genuine: 100,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.4,
        onUpdate: () => {
          if (hubsRef.current) {
            hubsRef.current.textContent = `${Math.floor(statsObj.hubs)}+ Hubs`
          }
          if (genuineRef.current) {
            genuineRef.current.textContent = `${Math.floor(statsObj.genuine)}%`
          }
        },
      })

      // 3. Gentle Parallax on the Lifestyle Imagery using ScrollTrigger
      if (imageWrapRef.current) {
        gsap.to('.hero-parallax-img', {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }
    },
    { scope: heroRef }
  )

  return (
    <section
      ref={heroRef}
      className="relative bg-sand-100/70 border-b border-sand-300 py-12 md:py-18 overflow-hidden"
    >
      {/* Subtle organic background accent glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-900/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-clay-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* UniMart Emblem + Campus Tag Badge */}
            <div className="hero-badge flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sand-300 shadow-subtle text-xs">
                <div className="w-4 h-4 rounded-full bg-forest-900 text-sand-200 flex items-center justify-center">
                  <GraduationCap className="w-2.5 h-2.5" />
                </div>
                <span className="font-bold text-forest-950">UniMart</span>
                <span className="text-sand-400">|</span>
                <span className="text-forest-800 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Dispatching to <strong>{currentCampus.shortName}</strong>
                </span>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-clay-700 bg-clay-50 px-2.5 py-1 rounded-full border border-clay-200">
                <Sparkles className="w-3 h-3 text-clay-500" />
                Semester 2026 Ready
              </span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-3">
              <h1 className="hero-title font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-bold tracking-tight text-forest-950 leading-[1.12]">
                Everything for your <br className="hidden sm:inline" />
                <span className="text-forest-800 italic font-serif">campus life</span>.
              </h1>
              <p className="hero-subtitle text-sm sm:text-base text-forest-900/85 leading-relaxed max-w-xl font-sans">
                Authentic HEC syllabus textbooks, bleed-resistant engineering notebooks, high-output GaN chargers, and commuter daypacks. Handed over directly at your university hostel gate or department desk.
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="hero-ctas flex flex-wrap items-center gap-3 pt-2">
              <Link to="/shop">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  className="shadow-card"
                >
                  Shop Now
                </Button>
              </Link>
              <a href="#categories">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Layers className="w-4 h-4 mr-1 text-forest-800" />}
                  className="bg-white/80 hover:bg-white"
                >
                  Explore Categories
                </Button>
              </a>
            </div>

            {/* Editorial Trust Metrics */}
            <div className="pt-6 border-t border-sand-300/80 grid grid-cols-3 gap-4 max-w-lg text-forest-950">
              <div className="hero-stat">
                <p ref={hubsRef} className="stat-hubs font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  12+ Hubs
                </p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                  Hostel Gates
                </p>
              </div>
              <div className="hero-stat">
                <p ref={genuineRef} className="stat-genuine font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  100%
                </p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                  Genuine Prints
                </p>
              </div>
              <div className="hero-stat">
                <p ref={expressRef} className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  &lt; 24 Hrs
                </p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                  Express Delivery
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Lifestyle Showcase Composition */}
          <div className="lg:col-span-5">
            <div ref={imageWrapRef} className="relative">
              
              {/* Decorative background border frame */}
              <div className="absolute -inset-3 rounded-lg border-2 border-dashed border-sand-400/60 pointer-events-none hidden sm:block" />

              {/* Main curated authentic student lifestyle imagery */}
              <div className="relative rounded-md overflow-hidden border border-sand-300 shadow-elevated bg-white">
                <div className="overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80"
                    alt="University student study desk with textbooks, notebooks, and headphones"
                    className="hero-parallax-img w-full h-80 sm:h-96 md:h-104 object-cover object-center transform scale-105 will-change-transform"
                  />
                </div>

                {/* Subtle dark gradient overlay at base for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-90 pointer-events-none" />
                
                {/* Floating bottom card */}
                <div className="hero-floating-card absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded border border-sand-200 shadow-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-clay-700 bg-clay-50 px-2 py-0.5 rounded border border-clay-200">
                        Semester Highlight
                      </span>
                      <h4 className="font-serif text-sm font-bold text-forest-950 mt-1">
                        Freshman Engineering & CS Starter Kits
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Save up to 22% on bundled course packs
                      </p>
                    </div>
                    <Link
                      to="/shop?category=student-bundles"
                      className="px-3.5 py-1.5 bg-forest-900 text-white rounded text-xs font-semibold hover:bg-forest-950 transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating top badge */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-forest-900 text-sand-100 p-3 rounded shadow-card border border-forest-800 text-xs items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white leading-none">Free Hostel Delivery</p>
                  <p className="text-[10px] text-sand-300 mt-0.5">On orders over Rs. 2,500</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
