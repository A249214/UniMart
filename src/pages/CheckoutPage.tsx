import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  AlertCircle,
  Banknote,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShoppingBag,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCampus } from '@/context/CampusContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { formatPKR } from '@/utils/formatters'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { orderService } from '@/services/orderService'
import { isFirebaseConfigured } from '@/services/firebase'
import { Order } from '@/types/order'

interface CheckoutErrors {
  studentName?: string
  studentId?: string
  phone?: string
  hostelWing?: string
  general?: string
}

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, shippingEstimate, total, clearCart } = useCart()
  const { currentCampus, setCampusById, campuses } = useCampus()
  const { showToast } = useToast()
  const { userProfile, user } = useAuth()
  const navigate = useNavigate()

  const [studentName, setStudentName] = useState(userProfile?.displayName || 'Hamza Tariq')
  const [studentId, setStudentId] = useState(userProfile?.studentId || '21I-0482')
  const [phone, setPhone] = useState(userProfile?.phone || '0300-1234567')
  const [hostelWing, setHostelWing] = useState(userProfile?.roomOrDesk || 'Boys Hostel 4 / Room 204')
  const [notes, setNotes] = useState('Please call upon arrival at campus gate.')
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod')
  
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  const isLiveFirebase = isFirebaseConfigured()

  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName && userProfile.displayName !== studentName) {
        setStudentName(userProfile.displayName)
      }
      if (userProfile.studentId && userProfile.studentId !== studentId) {
        setStudentId(userProfile.studentId)
      }
      if (userProfile.phone && userProfile.phone !== phone) {
        setPhone(userProfile.phone)
      }
      if (userProfile.roomOrDesk && userProfile.roomOrDesk !== hostelWing) {
        setHostelWing(userProfile.roomOrDesk)
      }
    }
  }, [userProfile, studentName, studentId, phone, hostelWing])

  const validateCheckout = (): boolean => {
    const newErrors: CheckoutErrors = {}

    // 1. Customer Name
    const trimmedName = studentName.trim()
    if (!trimmedName) {
      newErrors.studentName = 'Full student name is required.'
    } else if (trimmedName.length < 3) {
      newErrors.studentName = 'Name must be at least 3 characters.'
    }

    // 2. Student Roll No / ID
    if (!studentId.trim()) {
      newErrors.studentId = 'Student Roll Number or ID is required for verification.'
    }

    // 3. Phone validation (Pakistani mobile format)
    const phoneTrimmed = phone.trim().replace(/\s+/g, '')
    const phoneRegex = /^(\+92|0)?3[0-9]{2}-?[0-9]{7}$/
    if (!phoneTrimmed) {
      newErrors.phone = 'Contact phone number is required.'
    } else if (!phoneRegex.test(phoneTrimmed)) {
      newErrors.phone = 'Please enter a valid Pakistani mobile number (e.g. 0300-1234567).'
    }

    // 4. Delivery Drop Location
    const trimmedWing = hostelWing.trim()
    if (!trimmedWing) {
      newErrors.hostelWing = 'Hostel wing, room number, or campus department desk is required.'
    } else if (trimmedWing.length < 4) {
      newErrors.hostelWing = 'Please provide detailed drop point information (e.g. Hostel 3, Room 102).'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      showToast('Empty Cart', 'Your shopping cart is empty. Please add products first.', 'warning')
      navigate('/shop')
      return
    }

    if (!validateCheckout()) {
      showToast('Form Incomplete', 'Please correct the highlighted delivery fields.', 'warning')
      return
    }

    const activeUid = user?.uid || userProfile?.uid
    if (!activeUid) {
      showToast('Authentication Required', 'Please sign in to place your campus order.', 'warning')
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      /**
       * Trust and Security guarantee:
       * We send ONLY the product IDs and quantities to the trusted backend.
       * The backend authoritatively fetches current prices, checks inventory stock,
       * and calculates totals independently. Client prices/totals are NEVER trusted.
       */
      const order = await orderService.createVerifiedOrder({
        userId: activeUid,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedOption: item.selectedOption,
        })),
        shippingAddress: {
          customerName: studentName.trim(),
          contactPhone: phone.trim(),
          university: currentCampus.name,
          campus: currentCampus.shortName,
          hostelOrDepartment: hostelWing.trim(),
          roomOrDesk: '',
          city: currentCampus.city,
          studentId: studentId.trim(),
          deliveryNotes: notes.trim(),
        },
        paymentMethod: 'Cash on Delivery',
      })

      // Clear cart ONLY after confirmed backend success
      clearCart()
      setConfirmedOrder(order)
      showToast(
        'Campus Order Confirmed!',
        `Order #${order.orderNumber} successfully registered for ${currentCampus.shortName}.`,
        'success'
      )
    } catch (error: unknown) {
      const err = error as Error
      const msg = err.message || 'Could not place order. Please review your cart and try again.'
      setErrors({ general: msg })
      showToast('Order Placement Error', msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. Success confirmation state
  if (confirmedOrder) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-md border border-sand-300 shadow-elevated">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-800 bg-sand-100 px-3 py-1 rounded border border-sand-300">
            {isLiveFirebase ? 'Firestore Order Verified' : 'Session Order Verified'}
          </span>
          <h2 className="font-serif text-2xl font-bold text-forest-950 mt-3">
            Campus Order Confirmed!
          </h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Thank you, {studentName}! Your order has been registered in the system with tracking ID{' '}
            <strong className="text-forest-900 font-mono">#{confirmedOrder.orderNumber}</strong>.
          </p>

          <div className="my-6 p-4 bg-sand-50 rounded border border-sand-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono font-bold text-forest-950">#{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Campus Drop Point:</span>
              <span className="font-semibold text-forest-950">{currentCampus.shortName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hostel / Wing:</span>
              <span className="font-semibold text-forest-950">{hostelWing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold text-forest-950">
                {confirmedOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-bold text-amber-700 uppercase text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {confirmedOrder.status}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sand-200 text-sm">
              <span className="font-bold text-forest-950">Authoritative Total:</span>
              <span className="font-bold text-forest-950">{formatPKR(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/orders">
              <Button variant="primary" size="md">
                View My Campus Orders
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="md">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 2. Empty cart guard state
  if (cart.length === 0) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-md border border-sand-300 shadow-subtle">
          <div className="w-16 h-16 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-forest-700" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Your Cart is Empty</h2>
          <p className="text-xs text-muted-foreground mt-2 mb-6">
            You must add items to your cart before proceeding to checkout.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="md">
              Browse University Catalog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Backend Connected Banner */}
        <div
          className={`p-4 mb-8 rounded-md border flex items-start gap-3 shadow-subtle ${
            isLiveFirebase
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-sand-100/90 border-sand-300 text-forest-950'
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-forest-950">
              Campus Delivery Checkout — {isLiveFirebase ? 'Cloud Firestore Connected' : 'Simulated Session Mode'}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Trusted backend pricing and inventory verification are enforced. Deliveries coordinate directly with university hostel wardens and guard gates.
            </p>
          </div>
        </div>

        {/* Back to cart */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900 hover:text-clay-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping Cart</span>
          </Link>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-medium leading-relaxed">{errors.general}</div>
          </div>
        )}

        {/* Checkout Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" noValidate>
          
          {/* Left Form: Student Campus Delivery Info */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Student & Campus Details Card */}
            <div className="bg-white rounded-md border border-sand-300 p-6 shadow-subtle space-y-5">
              <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
                <GraduationCap className="w-5 h-5 text-forest-800" />
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Student Delivery Information
                </h3>
              </div>

              {/* University Selector */}
              <div>
                <label
                  htmlFor="checkout-campus"
                  className="block text-xs font-semibold uppercase tracking-wider text-forest-900/80 mb-1.5"
                >
                  University Campus Hub
                </label>
                <select
                  id="checkout-campus"
                  value={currentCampus.id}
                  onChange={(e) => setCampusById(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-sm bg-white border border-sand-300 rounded px-3 py-2 text-forest-950 font-medium focus:outline-none focus:border-forest-700 focus:ring-1 focus:ring-forest-700 disabled:bg-sand-100/60"
                >
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ({c.city})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Couriers have direct gate clearance agreements with this campus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="checkout-name"
                  label="Full Student Name"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value)
                    if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: undefined }))
                  }}
                  error={errors.studentName}
                  disabled={isSubmitting}
                  required
                />
                <Input
                  id="checkout-rollno"
                  label="Student Roll No / ID"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value)
                    if (errors.studentId) setErrors((prev) => ({ ...prev, studentId: undefined }))
                  }}
                  error={errors.studentId}
                  placeholder="e.g. 21I-1234"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="checkout-phone"
                  label="Contact Phone / WhatsApp"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                  }}
                  error={errors.phone}
                  placeholder="0300-1234567"
                  helperText="Courier calls upon arrival at campus gate"
                  disabled={isSubmitting}
                  required
                />
                <Input
                  id="checkout-hostel"
                  label="Hostel Wing / Room / Dept"
                  value={hostelWing}
                  onChange={(e) => {
                    setHostelWing(e.target.value)
                    if (errors.hostelWing) setErrors((prev) => ({ ...prev, hostelWing: undefined }))
                  }}
                  error={errors.hostelWing}
                  placeholder="e.g. Hostel 4, Room 312"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-semibold uppercase tracking-wider text-forest-900/80 mb-1.5"
                >
                  Delivery Instructions for Courier
                </label>
                <textarea
                  id="checkout-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                  rows={2}
                  className="w-full text-sm bg-white border border-sand-300 rounded px-3 py-2 text-forest-950 placeholder:text-muted-foreground focus:outline-none focus:border-forest-700 focus:ring-1 focus:ring-forest-700 disabled:bg-sand-100/60"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-md border border-sand-300 p-6 shadow-subtle space-y-4">
              <div className="border-b border-sand-200 pb-3">
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Payment Method
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cash on Delivery is the initial payment method for all campus shipments.
                </p>
              </div>

              <div className="p-4 rounded-md border border-forest-800 bg-sand-100/60 ring-1 ring-forest-800 flex items-start gap-3">
                <input
                  type="radio"
                  id="payment-cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-forest-800"
                />
                <label htmlFor="payment-cod" className="cursor-pointer">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-forest-950">
                    <Banknote className="w-4 h-4 text-forest-700" />
                    <span>Cash on Campus Delivery (Initial Payment Mode)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Pay the exact amount in cash (PKR) directly to the delivery courier when meeting at your university hostel gate or department desk. No credit card required.
                  </p>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-md border border-sand-300 p-6 shadow-subtle space-y-5">
              <h3 className="font-serif text-lg font-bold text-forest-950 border-b border-sand-200 pb-3">
                Order Review ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Item preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-sand-200 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <ImageWithFallback
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-10 h-10 object-cover rounded border border-sand-200"
                      />
                      <div>
                        <p className="font-semibold text-forest-950 line-clamp-1 max-w-[180px]">
                          {item.product.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity} × {formatPKR(item.product.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-forest-950">
                      {formatPKR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-3 border-t border-sand-200 text-xs text-forest-900">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Courier Delivery</span>
                  <span>{shippingEstimate === 0 ? 'FREE' : formatPKR(shippingEstimate)}</span>
                </div>
                <div className="pt-2 border-t border-sand-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-forest-950 font-serif">Total Payable</span>
                  <span className="text-xl font-bold text-forest-950 font-sans">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying & Recording Order...</span>
                  </span>
                ) : (
                  'Place Test Campus Order (Cash on Delivery)'
                )}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                <span>Trusted server-side price validation enforced</span>
              </p>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}
