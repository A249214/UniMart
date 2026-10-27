import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Send,
  Database,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { BackendStatusModal } from '@/components/common/BackendStatusModal'

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      showToast(
        'Subscribed to Campus Alerts',
        `We will notify ${email} about semester discounts and textbook arrivals.`,
        'success'
      )
      setEmail('')
    }
  }

  return (
    <footer className="bg-forest-950 text-sand-200 border-t border-forest-900 mt-auto">
      {/* Campus Value Props strip */}
      <div className="border-b border-forest-900/60 py-8 bg-forest-900/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sand-100">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded bg-forest-800/80 text-sand-200 border border-forest-700/60">
                <Truck className="w-5 h-5 text-clay-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct Hostel Delivery</h4>
                <p className="text-xs text-sand-300/80 mt-1">
                  Deliveries straight to your university gate, hostel reception, or department desk.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded bg-forest-800/80 text-sand-200 border border-forest-700/60">
                <ShieldCheck className="w-5 h-5 text-clay-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Verified Authentic Books</h4>
                <p className="text-xs text-sand-300/80 mt-1">
                  100% crisp typography, complete diagrams, and official curriculum editions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded bg-forest-800/80 text-sand-200 border border-forest-700/60">
                <RotateCcw className="w-5 h-5 text-clay-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">7-Day Study Guarantee</h4>
                <p className="text-xs text-sand-300/80 mt-1">
                  Defective electronics or damaged bindings replaced without campus hassle.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded bg-forest-800/80 text-sand-200 border border-forest-700/60">
                <GraduationCap className="w-5 h-5 text-clay-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Student Friendly Pricing</h4>
                <p className="text-xs text-sand-300/80 mt-1">
                  Subsidized rates and bulk semester discounts on essential study materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-forest-800 text-ivory-50 flex items-center justify-center border border-forest-700">
                <GraduationCap className="w-4 h-4 text-sand-200" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                UniMart
              </span>
            </div>
            
            <p className="text-xs text-sand-300 leading-relaxed max-w-sm">
              &ldquo;Everything for your campus life.&rdquo; UniMart is Pakistan’s dedicated student e-commerce hub, providing engineering textbooks, note-taking stationery, tech accessories, and commuter essentials to dorms across the country.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-forest-900 hover:bg-forest-850 border border-forest-800 text-xs text-sand-300 transition-colors text-left group"
                title="Click to check Firebase & Cloudinary status or seed Firestore"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="group-hover:text-white">Backend Status: Firestore & Cloudinary Active</span>
                <Database className="w-3.5 h-3.5 ml-1 text-sand-400 group-hover:text-clay-300" />
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-sand-300">
              <li>
                <Link to="/shop?category=stationery" className="hover:text-white transition-colors">
                  Stationery
                </Link>
              </li>
              <li>
                <Link to="/shop?category=books" className="hover:text-white transition-colors">
                  Books & Textbooks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tech-accessories" className="hover:text-white transition-colors">
                  Tech Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bags" className="hover:text-white transition-colors">
                  Bags & Backpacks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=student-bundles" className="hover:text-white transition-colors">
                  Student Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Hubs */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Campus Hubs
            </h4>
            <ul className="space-y-1.5 text-xs text-sand-300">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-clay-400 shrink-0" />
                <span>Islamabad (NUST, FAST, COMSATS)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-clay-400 shrink-0" />
                <span>Lahore (LUMS, FAST, UET, PU)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-clay-400 shrink-0" />
                <span>Karachi (IBA, FAST, NED, AKU)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-clay-400 shrink-0" />
                <span>Topi, KPK (GIKI Campus)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-clay-400 shrink-0" />
                <span>Peshawar & Quetta Hubs</span>
              </li>
            </ul>
          </div>

          {/* Student Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Campus Drops
            </h4>
            <p className="text-xs text-sand-300 leading-relaxed mb-3">
              Subscribe with your university email for flash book sales and exam-week essentials.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@nu.edu.pk"
                  required
                  className="w-full bg-forest-900 text-xs text-white placeholder:text-sand-400/50 rounded border border-forest-700/80 px-3 py-2 focus:outline-none focus:border-sand-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-clay-600 hover:bg-clay-700 text-white rounded text-xs flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar with functional working links */}
        <div className="mt-12 pt-6 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <p>© {CURRENT_YEAR} UniMart Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="hover:text-sand-200 transition-colors">Catalog</Link>
            <Link to="/cart" className="hover:text-sand-200 transition-colors">Cart</Link>
            <Link to="/orders" className="hover:text-sand-200 transition-colors">Orders</Link>
            <Link to="/login" className="hover:text-sand-200 transition-colors">Student Portal</Link>
          </div>
        </div>
      </div>

      {/* Backend & Cloudinary Status Modal */}
      <BackendStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </footer>
  )
}
