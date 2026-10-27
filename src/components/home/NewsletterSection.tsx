import React, { useState, useRef } from 'react'
import { Mail, Send, CheckCircle2, Copy, Sparkles } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/utils/gsap'

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const { showToast } = useToast()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.newsletter-card', { opacity: 1, scale: 1, y: 0 })
        return
      }

      gsap.fromTo(
        '.newsletter-card',
        { opacity: 0, scale: 0.97, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribed(true)
    showToast(
      'Joined UniMart Campus Club',
      `Welcome! Your 10% student voucher code "MIDTERM10" is active.`,
      'success'
    )
  }

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('MIDTERM10')
    setCopiedCode(true)
    showToast('Code Copied', 'Voucher "MIDTERM10" copied to your clipboard.', 'info')
    setTimeout(() => setCopiedCode(false), 2500)
  }

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 bg-forest-950 text-sand-100 relative overflow-hidden">
      {/* Subtle organic background ring decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-forest-800/30 blur-3xl pointer-events-none -translate-y-1/2 -ml-24" />
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-clay-600/10 blur-3xl pointer-events-none -translate-y-1/2 -mr-24" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="newsletter-card rounded-lg border border-forest-800 bg-forest-900/60 backdrop-blur-xs p-8 sm:p-12 shadow-elevated">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            
            {/* Tag badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 border border-forest-700 text-xs font-semibold text-sand-200">
              <Sparkles className="w-3.5 h-3.5 text-clay-400" />
              <span>Campus Club & Semester Alerts</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Get Student Flash Drops & Semester Discounts
            </h2>

            <p className="text-xs sm:text-sm text-sand-300 leading-relaxed max-w-lg mx-auto">
              Subscribe with your official university email for alerts on new syllabus shipments, calculator restocks, and exclusive hostel drop discounts.
            </p>

            {/* Voucher Code Box */}
            <div className="inline-flex items-center gap-2 p-1.5 pl-3 bg-forest-950/80 rounded border border-forest-800 text-xs text-sand-200">
              <span>Use voucher: <strong className="font-mono text-white tracking-wider">MIDTERM10</strong> for 10% off</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2 py-1 rounded bg-forest-800 hover:bg-forest-700 text-[11px] font-semibold text-sand-100 flex items-center gap-1 transition-colors"
                title="Copy voucher code"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-sand-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Form */}
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="pt-2 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@nu.edu.pk or nust.edu.pk"
                      required
                      className="w-full bg-forest-950/90 text-xs text-white placeholder:text-sand-400/50 rounded border border-forest-700 px-3.5 py-3 pl-9 focus:outline-none focus:border-sand-300 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-sand-400/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-clay-600 hover:bg-clay-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-subtle shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-sand-400/70 mt-2 text-center">
                  Zero spam. Only textbook arrivals & campus courier updates.
                </p>
              </form>
            ) : (
              <div className="p-4 bg-forest-800/80 rounded border border-forest-700 text-xs text-sand-100 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are subscribed! We will notify <strong>{email}</strong> on upcoming campus drops.</span>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  )
}
