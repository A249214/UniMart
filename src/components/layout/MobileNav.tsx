import React from 'react'
import { Link } from 'react-router-dom'
import {
  X,
  GraduationCap,
  MapPin,
  BookOpen,
  PenTool,
  Briefcase,
  Zap,
  PackageCheck,
  User,
  ShoppingBag,
} from 'lucide-react'
import { useCampus } from '@/context/CampusContext'
import { useCart } from '@/context/CartContext'

import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LogOut } from 'lucide-react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentCampus, setCampusById, campuses } = useCampus()
  const { totalItems } = useCart()
  const { isAuthenticated, userProfile, user, logout } = useAuth()
  const { showToast } = useToast()

  if (!isOpen) return null

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student'

  const handleLogout = async () => {
    onClose()
    await logout()
    showToast('Signed Out', 'You have been logged out of your session.', 'info')
  }

  const categories = [
    { label: 'All Campus Products', href: '/shop', icon: ShoppingBag },
    { label: 'Stationery', href: '/shop?category=stationery', icon: PenTool },
    { label: 'Books', href: '/shop?category=books', icon: BookOpen },
    { label: 'Tech Accessories', href: '/shop?category=tech-accessories', icon: Zap },
    { label: 'Bags', href: '/shop?category=bags', icon: Briefcase },
    { label: 'Student Bundles', href: '/shop?category=student-bundles', icon: GraduationCap },
  ]

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-elevated border-r border-sand-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-sand-200 flex items-center justify-between bg-sand-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-forest-900 text-ivory-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-sand-200" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-forest-950 block leading-tight">
                UniMart
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Campus Marketplace
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-sand-200 text-forest-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campus Quick Switcher in Mobile Nav */}
        <div className="p-4 bg-sand-100/50 border-b border-sand-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-900 mb-2">
            <MapPin className="w-3.5 h-3.5 text-clay-600" />
            <span>Select Campus Hub</span>
          </div>
          <select
            value={currentCampus.id}
            onChange={(e) => setCampusById(e.target.value)}
            className="w-full text-xs bg-white border border-sand-300 rounded px-2.5 py-1.5 text-forest-900 font-medium focus:outline-none focus:border-forest-700"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName} ({c.city})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Default delivery point: {currentCampus.popularDeliveryPoints[0]}
          </p>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Browse Categories
            </h4>
            <ul className="space-y-1">
              {categories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <li key={cat.href}>
                    <Link
                      to={cat.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-forest-900 hover:bg-sand-100 rounded-md transition-colors"
                    >
                      <IconComponent className="w-4 h-4 text-forest-700" />
                      <span>{cat.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Student Account Links */}
          <div className="pt-3 border-t border-sand-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Student Account
            </h4>
            {isAuthenticated ? (
              <div className="mb-3 p-3 bg-sand-100/70 rounded-md border border-sand-300">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-forest-900 text-sand-100 flex items-center justify-center text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-forest-950 truncate">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{userProfile?.studentId || user?.email}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <ul className="space-y-1">
              <li>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-forest-900 hover:bg-sand-100 rounded-md transition-colors"
                >
                  <PackageCheck className="w-4 h-4 text-forest-700" />
                  <span>My Campus Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 text-sm text-forest-900 hover:bg-sand-100 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-forest-700" />
                    <span>Shopping Cart</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-clay-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-forest-900 hover:bg-sand-100 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4 text-forest-700" />
                    <span>Sign In / Student Portal</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Mobile Nav Footer */}
        <div className="p-4 bg-sand-50 border-t border-sand-200 text-xs text-muted-foreground">
          <p className="font-semibold text-forest-900">UniMart Pakistan</p>
          <p className="text-[11px] mt-0.5">Hostel & campus deliveries across all major cities.</p>
        </div>
      </div>
    </div>
  )
}
