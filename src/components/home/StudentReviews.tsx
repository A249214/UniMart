import React, { useRef } from 'react'
import { Star, Quote, CheckCircle2 } from 'lucide-react'
import { MOCK_REVIEWS } from '@/data/mockProducts'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const StudentReviews: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(['.reviews-header', '.review-card'], { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        '.reviews-header',
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
        '.review-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.65,
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

  return (
    <section ref={sectionRef} className="py-14 sm:py-18 bg-sand-100/50 border-b border-sand-300">
      <div className="container mx-auto px-4">
        
        <div className="reviews-header text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-clay-700 bg-clay-50 px-2.5 py-1 rounded border border-clay-200">
            Student Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-2">
            Loved Across Pakistani Campuses
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Read what undergrads and postgrads from NUST, LUMS, FAST, and IBA have to say about ordering with UniMart.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="review-card bg-white rounded-md border border-sand-300 p-5 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-forest-800/20" />
                </div>

                <p className="text-xs text-forest-900 leading-relaxed italic font-serif">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-forest-950 flex items-center gap-1">
                    {review.author}
                    <CheckCircle2 className="w-3 h-3 text-forest-700" />
                  </h4>
                  <p className="text-[10px] text-muted-foreground">{review.university}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">Verified Student</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
