import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Loader2,
} from 'lucide-react'
import { Order } from '@/types/order'
import { formatPKR, formatDate } from '@/utils/formatters'
import { useCampus } from '@/context/CampusContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { orderService } from '@/services/orderService'
import { useAuth } from '@/context/AuthContext'

export const MyOrdersPage: React.FC = () => {
  const { currentCampus } = useCampus()
  const { showToast } = useToast()
  const { user, userProfile } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Baseline university orders
  const sampleOrders: Order[] = useMemo(
    () => [
      {
        id: 'ord-01',
        orderNumber: 'UM-84920',
        date: '2026-10-24T10:30:00Z',
        status: 'out_for_delivery',
        estimatedDelivery: 'Today, by 4:00 PM',
        subtotal: 5700,
        deliveryFee: 0,
        total: 5700,
        paymentMethod: 'Cash on Campus Delivery',
        shippingAddress: {
          university: currentCampus.name,
          campus: currentCampus.shortName,
          hostelOrDepartment: 'Hostel 3 (Liaquat Block)',
          roomOrDesk: 'Room 214',
          city: currentCampus.city,
          contactPhone: '0300-9876543',
          studentId: '21I-0482',
        },
        items: [
          {
            id: 'prod-tb-01',
            title: "Thomas' Calculus (14th Metric Edition in SI Units)",
            price: 3850,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
          },
          {
            id: 'prod-st-01',
            title: 'Campus Heavy-Duty B5 Dot-Grid Notebook (3-Pack)',
            price: 1850,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        id: 'ord-02',
        orderNumber: 'UM-81204',
        date: '2026-09-28T14:15:00Z',
        status: 'delivered',
        estimatedDelivery: 'Delivered to Hostel Warden Desk',
        subtotal: 6900,
        deliveryFee: 0,
        total: 6900,
        paymentMethod: 'Raast Digital Transfer',
        shippingAddress: {
          university: currentCampus.name,
          campus: currentCampus.shortName,
          hostelOrDepartment: 'Department of Computer Science',
          roomOrDesk: 'Lab 4 Desk 12',
          city: currentCampus.city,
          contactPhone: '0300-9876543',
          studentId: '21I-0482',
        },
        items: [
          {
            id: 'prod-ch-01',
            title: 'Anker 65W GaN III 3-Port Fast Wall Charger',
            price: 6900,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
    ],
    [currentCampus]
  )

  const activeUid = user?.uid || userProfile?.uid

  useEffect(() => {
    let isMounted = true

    async function fetchOrders() {
      setIsLoading(true)
      try {
        const userOrders = await orderService.getUserOrders(activeUid)
        if (isMounted) {
          // Merge user-placed orders with sample orders
          const combined = [
            ...userOrders,
            ...sampleOrders.filter((s) => !userOrders.some((u) => u.orderNumber === s.orderNumber)),
          ]
          setOrders(combined)
        }
      } catch (error) {
        console.warn('[UniMart MyOrdersPage] Error loading orders:', error)
        if (isMounted) setOrders(sampleOrders)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchOrders()
    return () => {
      isMounted = false
    }
  }, [activeUid, sampleOrders])

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-900 border border-amber-300">
            <Truck className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>Out for Campus Delivery</span>
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivered & Handed Over</span>
          </span>
        )
      case 'processing':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-sand-100 text-forest-900 border border-sand-300">
            <Clock className="w-3.5 h-3.5 text-forest-700" />
            <span>Processing at Hub</span>
          </span>
        )
    }
  }

  const handleTrackCourier = (orderNumber: string) => {
    showToast(
      `Live Tracking: ${orderNumber}`,
      'Courier is currently inside campus delivering to university hostels. You will receive an SMS when approaching your gate.',
      'info'
    )
  }

  return (
    <div className="flex-1 bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand-300 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-forest-800" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                My Campus Orders
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active and delivered shipments to your university gate & hostel desk.
            </p>
          </div>

          <Link to="/shop">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
              Explore University Shop
            </Button>
          </Link>
        </div>

        {/* Orders Stack */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-md border border-sand-300 p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-forest-800" />
              <p className="text-xs">Loading campus orders from Firestore...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-md border border-sand-300 p-12 text-center text-muted-foreground space-y-4">
              <ShoppingBag className="w-10 h-10 text-sand-400 mx-auto" />
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">No Campus Orders Yet</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You haven&apos;t placed any semester textbook or supply orders yet.
                </p>
              </div>
              <Link to="/shop">
                <Button variant="primary" size="md">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-md border border-sand-300 shadow-subtle overflow-hidden"
              >
              {/* Order Card Header */}
              <div className="p-4 sm:p-5 bg-sand-50/70 border-b border-sand-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Order Placed
                    </span>
                    <span className="font-semibold text-forest-950">{formatDate(order.date)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Order ID
                    </span>
                    <span className="font-mono font-bold text-forest-950">#{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Total Payable
                    </span>
                    <span className="font-bold text-forest-950">{formatPKR(order.total)}</span>
                  </div>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Delivery Destination Strip */}
              <div className="px-5 py-3 bg-white border-b border-sand-200/80 flex items-center gap-2 text-xs text-forest-900">
                <MapPin className="w-4 h-4 text-clay-600 shrink-0" />
                <span>
                  <strong>Drop Point:</strong> {order.shippingAddress.campus} —{' '}
                  {order.shippingAddress.hostelOrDepartment}, {order.shippingAddress.roomOrDesk}
                </span>
              </div>

              {/* Items List */}
              <div className="p-5 divide-y divide-sand-200">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded border border-sand-200"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-forest-950 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Quantity: {item.quantity} × {formatPKR(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-forest-950">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions Footer */}
              <div className="p-4 bg-sand-50/50 border-t border-sand-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-muted-foreground">
                  Status note: <strong className="text-forest-950">{order.estimatedDelivery}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrackCourier(order.orderNumber)}
                  >
                    Track Courier
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      showToast(
                        'Invoice Download',
                        `Official university receipt for Order #${order.orderNumber} prepared for download.`,
                        'info'
                      )
                    }}
                  >
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        </div>

      </div>
    </div>
  )
}
