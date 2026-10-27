import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useCart } from '@/context/CartContext'
import { useCampus } from '@/context/CampusContext'
import { Button } from '@/components/common/Button'
import {
  ShoppingBag,
  Search,
  Menu,
  GraduationCap,
  MapPin,
  ChevronDown,
  User,
  PackageCheck,
  LogOut,
} from 'lucide-react'

interface HeaderProps {
  onOpenMobileNav: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { totalItems } = useCart()
  const { currentCampus, setCampusById, campuses } = useCampus()
  const { isAuthenticated, userProfile, user, logout } = useAuth()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCampusMenuOpen, setIsCampusMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student'

  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    await logout()
    showToast('Signed Out', 'You have been securely signed out of your student session.', 'info')
    navigate('/login')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/shop')
    }
  }

  const navCategories = [
    { label: 'All Products', href: '/shop' },
    { label: 'Stationery', href: '/shop?category=stationery' },
    { label: 'Books', href: '/shop?category=books' },
    { label: 'Tech Accessories', href: '/shop?category=tech-accessories' },
    { label: 'Bags', href: '/shop?category=bags' },
    { label: 'Student Bundles', href: '/shop?category=student-bundles' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-sand-300">
      {/* Primary Navigation Row */}
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Mobile menu toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 rounded-md hover:bg-sand-100 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded bg-forest-900 text-ivory-50 flex items-center justify-center shadow-subtle group-hover:bg-forest-950 transition-colors">
                <GraduationCap className="w-5 h-5 text-sand-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-forest-950 leading-none">
                  UniMart
                </span>
                <span className="text-[10px] tracking-wider uppercase font-medium text-forest-700/70 hidden sm:block mt-0.5">
                  Everything for your campus life
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-lg hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, notebooks, chargers, bags..."
                className="w-full bg-sand-50/70 text-sm text-forest-950 placeholder:text-forest-800/40 rounded border border-sand-300 pl-10 pr-20 py-2 focus:outline-none focus:bg-white focus:border-forest-700 focus:ring-1 focus:ring-forest-700 transition-all"
              />
              <Search className="w-4 h-4 text-forest-700/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs font-semibold px-2.5 py-1 bg-forest-900 text-ivory-100 rounded hover:bg-forest-950 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons: Campus Selector, Orders, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Campus Selector Dropdown */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setIsCampusMenuOpen(!isCampusMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-forest-900 bg-sand-100 hover:bg-sand-200/80 px-2.5 py-1.5 rounded border border-sand-300 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-clay-600" />
                <span className="truncate max-w-[130px]">{currentCampus.shortName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-forest-700" />
              </button>

              {isCampusMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-72 bg-white rounded-md shadow-elevated border border-sand-300 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setIsCampusMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-sand-200">
                    <p className="text-xs font-semibold text-forest-950">Select Your University</p>
                    <p className="text-[11px] text-muted-foreground">Sets delivery point estimates for your hostel</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {campuses.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCampusById(c.id)
                          setIsCampusMenuOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-sand-100 flex items-center justify-between ${
                          currentCampus.id === c.id ? 'bg-sand-100/80 font-semibold text-forest-900' : 'text-forest-800'
                        }`}
                      >
                        <div>
                          <div>{c.shortName}</div>
                          <div className="text-[10px] text-muted-foreground">{c.city}</div>
                        </div>
                        {currentCampus.id === c.id && (
                          <span className="w-2 h-2 rounded-full bg-forest-700" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* My Orders link */}
            <Link
              to="/orders"
              className="hidden lg:flex items-center gap-1 text-xs font-medium text-forest-900 hover:text-clay-700 transition-colors px-2 py-1.5"
            >
              <PackageCheck className="w-4 h-4 text-forest-700" />
              <span>Orders</span>
            </Link>

            {/* Login / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-forest-950 hover:text-clay-700 transition-colors px-2.5 py-1.5 rounded-md hover:bg-sand-100/80 border border-sand-300/80"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="w-5 h-5 rounded-full bg-forest-900 text-sand-100 flex items-center justify-center text-[10px] font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-forest-700" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md border border-sand-300 shadow-elevated z-50 py-1.5 text-xs">
                      <div className="px-3.5 py-2 border-b border-sand-200">
                        <p className="font-semibold text-forest-950 truncate">{displayName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {userProfile?.studentId || user?.email || 'Accredited Student'}
                        </p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-forest-800 bg-sand-100 px-1.5 py-0.5 rounded">
                          {userProfile?.campus || currentCampus.shortName}
                        </span>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-forest-900 hover:bg-sand-50 transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-forest-700" />
                        <span>My Campus Orders</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-rose-700 hover:bg-rose-50 transition-colors border-t border-sand-200 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-medium text-forest-900 hover:text-clay-700 transition-colors px-2 py-1.5"
              >
                <User className="w-4 h-4 text-forest-700" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link to="/cart">
              <Button
                variant="primary"
                size="sm"
                className="relative pl-3 pr-3 sm:pr-4 py-1.5 h-9"
              >
                <ShoppingBag className="w-4 h-4 mr-1.5 text-sand-200" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="ml-1.5 bg-clay-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

        </div>

        {/* Mobile Search Bar row */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-3 md:hidden"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, pens, chargers, bags..."
              className="w-full bg-sand-50 text-xs text-forest-950 placeholder:text-forest-800/50 rounded border border-sand-300 pl-9 pr-16 py-2"
            />
            <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-[11px] font-semibold px-2 py-1 bg-forest-900 text-white rounded"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Sub-navigation category row */}
      <nav className="hidden lg:block bg-sand-50/60 border-t border-sand-200/80">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-7 text-xs font-medium text-forest-900/80 py-2">
            {navCategories.map((cat) => {
              const isActive = location.pathname + location.search === cat.href
              return (
                <li key={cat.href}>
                  <Link
                    to={cat.href}
                    className={`transition-colors py-1 inline-block hover:text-forest-950 ${
                      isActive
                        ? 'text-forest-950 font-bold border-b-2 border-forest-800 -mb-[9px]'
                        : 'hover:border-b-2 hover:border-sand-400 hover:-mb-[9px]'
                    }`}
                  >
                    {cat.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </header>
  )
}
