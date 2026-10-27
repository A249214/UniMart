import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Check,
  MapPin,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCampus } from '@/context/CampusContext'
import { useToast } from '@/context/ToastContext'
import { formatPKR } from '@/utils/formatters'
import { Button } from '@/components/common/Button'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shippingEstimate,
    total,
  } = useCart()
  const { currentCampus } = useCampus()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    if (couponCode.trim().toUpperCase() === 'MIDTERM10') {
      const discount = Math.round(subtotal * 0.1)
      setAppliedDiscount(discount)
      showToast(
        'Student Voucher Applied',
        `10% Midterm discount (-${formatPKR(discount)}) applied to your cart.`,
        'success'
      )
    } else {
      showToast(
        'Invalid Voucher Code',
        'Try code "MIDTERM10" for 10% student semester savings.',
        'warning'
      )
    }
  }

  const finalTotal = Math.max(0, total - appliedDiscount)
  const remainingForFreeDelivery = Math.max(0, 2500 - subtotal)

  if (cart.length === 0) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-md border border-sand-300 shadow-subtle">
          <div className="w-16 h-16 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-forest-700" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Your Campus Cart is Empty</h2>
          <p className="text-xs text-muted-foreground mt-2 mb-6">
            You haven't added any textbooks, stationery, or study accessories to your cart yet.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Explore University Catalog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-forest-800">
            Review Order
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Your Campus Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {/* 2-Column layout: Items list and Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Delivery Threshold banner */}
            <div className="p-4 bg-sand-100/80 rounded-md border border-sand-300">
              {remainingForFreeDelivery > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-forest-950">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-clay-600" />
                      <span>Add {formatPKR(remainingForFreeDelivery)} more for Free Campus Delivery!</span>
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {Math.round((subtotal / 2500) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-800 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 2500) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-forest-900">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Congratulations! Your order qualifies for Free Hostel Desk Delivery.</span>
                </div>
              )}
            </div>

            {/* Items table / card view */}
            <div className="bg-white rounded-md border border-sand-300 shadow-subtle overflow-hidden divide-y divide-sand-200">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded border border-sand-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700">
                        {item.product.categoryLabel}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-forest-950 hover:text-clay-700 transition-colors">
                        <Link to={`/product/${item.product.id}`}>
                          {item.product.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Unit Price: <span className="font-semibold text-forest-950">{formatPKR(item.product.price)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-sand-100">
                    {/* Quantity controls */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center border border-sand-300 rounded bg-sand-50/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-sand-200 text-forest-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-forest-950 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= (item.product.stockCount ?? item.product.stock ?? 99)}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-sand-200 text-forest-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.quantity >= (item.product.stockCount ?? item.product.stock ?? 99) && (
                        <span className="text-[10px] text-amber-700 font-medium mt-1">
                          Max stock reached
                        </span>
                      )}
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-20">
                      <span className="text-sm font-bold text-forest-950">
                        {formatPKR(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart & Continue Shopping */}
            <div className="flex items-center justify-between text-xs pt-2">
              <Link to="/shop" className="text-forest-900 hover:text-clay-600 font-semibold underline underline-offset-2">
                ← Continue Browsing Campus Catalog
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-muted-foreground hover:text-red-600 transition-colors"
              >
                Clear all items
              </button>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-md border border-sand-300 shadow-subtle p-6 space-y-5">
              <h3 className="font-serif text-lg font-bold text-forest-950 border-b border-sand-200 pb-3">
                Order Summary
              </h3>

              {/* Campus Destination Preview */}
              <div className="p-3 bg-sand-50 rounded border border-sand-200 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-forest-950 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-clay-600" />
                  <span>Campus Delivery Hub</span>
                </div>
                <p className="text-forest-900 font-medium">{currentCampus.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Drop Point: {currentCampus.popularDeliveryPoints[0]}
                </p>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Student Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="MIDTERM10"
                    className="flex-1 text-xs bg-sand-50 border border-sand-300 rounded px-2.5 py-2 uppercase font-mono text-forest-900 focus:outline-none focus:border-forest-700"
                  />
                  <Button variant="secondary" size="sm" type="submit">
                    Apply
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">Tip: Enter MIDTERM10 for 10% off</p>
              </form>

              {/* Price Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-sand-200 text-xs text-forest-900">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold">{formatPKR(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Student Discount (10%)</span>
                    <span>-{formatPKR(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Campus Courier Delivery</span>
                  <span>
                    {shippingEstimate === 0 ? (
                      <strong className="text-emerald-700 font-semibold uppercase text-[11px]">
                        FREE
                      </strong>
                    ) : (
                      formatPKR(shippingEstimate)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-sand-300 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-forest-950 font-serif">Estimated Total</span>
                  <span className="text-xl font-bold text-forest-950 font-sans">
                    {formatPKR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/checkout')}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                Proceed to Campus Checkout
              </Button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                  <span>Secure student checkout • Cash on Delivery available</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
