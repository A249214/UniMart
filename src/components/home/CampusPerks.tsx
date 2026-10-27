import React, { useRef } from 'react'
import { MapPin, BookCheck, BatteryCharging, Clock } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const CampusPerks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const perksGridRef = useRef<HTMLDivElement>(null)

  const perks = [
    {
      icon: MapPin,
      title: 'Direct Hostel & Department Kiosks',
      description:
        'Deliveries coordinate directly with hostel wardens, reception desks, and campus guard gates at NUST, FAST, LUMS, IBA, GIKI, and partner universities.',
    },
    {
      icon: BookCheck,
      title: 'Verified Syllabi Prints Only',
      description:
        'Every single textbook is vetted for crisp diagram resolution, authentic SI metric problems, and complete index sections required by course instructors.',
    },
    {
      icon: BatteryCharging,
      title: 'Loadshedding-Ready Study Tech',
      description:
        'From 65W laptop-capable power banks to battery-powered warm LED study lights, study continuously even when campus grids experience outages.',
    },
    {
      icon: Clock,
      title: 'Under 24-Hour Campus Dispatch',
      description:
        'Local warehouse hubs in Islamabad, Lahore, and Karachi keep top academic titles and stationery stocked for semester rush deliveries.',
    },
  ]

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(['.perks-header', '.perk-card', '.ambassador-banner'], { opacity: 1, y: 0, scale: 1 })
        return
      }

      // ScrollTrigger section header
      gsap.fromTo(
        '.perks-header',
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

      // Staggered perk cards
      gsap.fromTo(
        '.perk-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: perksGridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // Ambassador banner
      gsap.fromTo(
        '.ambassador-banner',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.ambassador-banner',
            start: 'top 90%',
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
      className="py-14 sm:py-18 bg-white border-b border-sand-300"
    >
      <div className="container mx-auto px-4">
        
        <div className="perks-header max-w-2xl mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-forest-800 bg-sand-100 px-2.5 py-1 rounded border border-sand-300">
            Engineered For Student Life
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-2">
            Why UniMart Exists
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Standard couriers refuse to enter university hostel premises. Local bazaars are miles away. We built a platform designed around Pakistani campus realities.
          </p>
        </div>

        <div
          ref={perksGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {perks.map((perk, idx) => {
            const Icon = perk.icon
            return (
              <div
                key={idx}
                className="perk-card p-5 rounded-md border border-sand-300 bg-sand-50/40 hover:bg-white hover:border-forest-700/50 hover:shadow-subtle hover:-translate-y-0.5 transition-all duration-200 will-change-transform"
              >
                <div className="w-10 h-10 rounded bg-forest-900 text-sand-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sand-200" />
                </div>
                <h3 className="font-serif text-base font-bold text-forest-950 mb-2">
                  {perk.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {perk.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Campus partner banner */}
        <div className="ambassador-banner mt-12 p-6 bg-forest-950 text-sand-100 rounded-md border border-forest-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-lg font-bold text-white">
              Are you a Campus Ambassador or Student Society?
            </h4>
            <p className="text-xs text-sand-300 max-w-xl">
              We partner with university societies (ACM, IEEE, Business Clubs) for bulk semester batch discounts and dedicated delivery desks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-sand-200 font-semibold px-3 py-1.5 rounded bg-forest-900 border border-forest-800">
              Ambassador Program Active
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
