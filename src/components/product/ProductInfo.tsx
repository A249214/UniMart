import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  MapPin,
  Check,
} from 'lucide-react'
import { Product } from '@/types/product'
import { formatPKR } from '@/utils/formatters'
import { useCart } from '@/context/CartContext'
import { useCampus } from '@/context/CampusContext'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'

interface ProductInfoProps {
  product: Product
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { currentCampus } = useCampus()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Category & SKU */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-sand-200 pb-3">
        <span className="uppercase tracking-wider font-semibold text-forest-800">
          {product.categoryLabel}
        </span>
        <span className="font-mono text-[11px]">SKU: {product.sku}</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 leading-tight">
          {product.title}
        </h1>
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-3 mt-2 text-xs">
          <div className="flex items-center gap-1 text-amber-600">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-sand-300'
                }`}
              />
            ))}
            <span className="font-bold ml-1 text-forest-950">{product.rating}</span>
          </div>
          <span className="text-sand-400">|</span>
          <span className="text-muted-foreground">{product.reviewCount} verified campus reviews</span>
          <span className="text-sand-400">|</span>
          <span className="text-forest-700 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>In Stock ({product.stockCount} available)</span>
          </span>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="p-4 bg-sand-50/80 rounded-md border border-sand-200/90 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-bold text-forest-950 font-sans tracking-tight">
              {formatPKR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Inclusive of all taxes. Free hostel delivery over Rs. 2,500.
          </p>
        </div>

        {discountPercent > 0 && (
          <Badge variant="clay" className="text-xs font-bold px-2.5 py-1">
            Save {discountPercent}%
          </Badge>
        )}
      </div>

      {/* Campus Delivery box */}
      <div className="p-3.5 rounded-md border border-forest-900/20 bg-forest-50/50 flex items-start gap-3 text-xs">
        <MapPin className="w-4 h-4 text-forest-800 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-forest-950">
            Hostel Delivery Hub: <span className="underline underline-offset-2">{currentCampus.shortName}</span>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {product.deliveryTimeEstimate}. Handed over directly at campus reception or hostel security gate.
          </p>
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-sand-300 rounded bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-sand-100 text-forest-900 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-semibold text-forest-950 min-w-10 text-center">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= (product.stockCount ?? product.stock ?? 99)}
              onClick={() => setQuantity((q) => Math.min(product.stockCount ?? product.stock ?? 99, q + 1))}
              className="p-2 hover:bg-sand-100 text-forest-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            leftIcon={<ShoppingBag className="w-4 h-4 mr-2" />}
            className="flex-1"
          >
            Add to Campus Cart
          </Button>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleBuyNow}
          className="w-full bg-sand-200 hover:bg-sand-300 text-forest-950 font-semibold"
        >
          Proceed to Order
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-sand-200 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
          <span>Original & Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-forest-700 shrink-0" />
          <span>7-Day Replacement</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-forest-700 shrink-0" />
          <span>Campus Gate Handover</span>
        </div>
      </div>
    </div>
  )
}
