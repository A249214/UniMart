import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Eye, CheckCircle2, AlertCircle } from 'lucide-react'
import { Product } from '@/types/product'
import { formatPKR } from '@/utils/formatters'
import { useCart } from '@/context/CartContext'
import { Badge } from '@/components/common/Badge'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart()

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const isLowStock = product.inStock && product.stockCount > 0 && product.stockCount <= 10

  return (
    <div
      className={`group relative bg-white rounded-md border border-sand-300 shadow-subtle hover:shadow-card hover:border-forest-700/40 hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden will-change-transform ${className}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 sm:aspect-square bg-sand-100/60 overflow-hidden border-b border-sand-200">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.badge && (
            <Badge variant="clay" className="shadow-xs text-[11px] font-medium tracking-tight">
              {product.badge}
            </Badge>
          )}
          {discountPercent > 0 && !product.badge?.includes('%') && (
            <Badge variant="academic" className="shadow-xs text-[10px] font-semibold bg-white/95 text-forest-900 border-sand-300">
              Save {discountPercent}%
            </Badge>
          )}
        </div>

        {/* Stock Status Pill on Image */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          {product.inStock && product.stockCount > 0 ? (
            isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50/95 text-amber-800 border border-amber-300/80 backdrop-blur-xs">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Only {product.stockCount} left</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50/95 text-emerald-800 border border-emerald-300/80 backdrop-blur-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>In Stock</span>
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50/95 text-red-800 border border-red-300/80 backdrop-blur-xs">
              <span>Out of Stock</span>
            </span>
          )}
        </div>

        {/* Quick View Hover Action */}
        <div className="absolute inset-0 bg-forest-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
          <Link
            to={`/product/${product.id}`}
            className="px-3.5 py-1.5 bg-white text-forest-900 rounded text-xs font-semibold shadow hover:bg-forest-900 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <Link
              to={`/shop?category=${product.category}`}
              className="uppercase tracking-wider text-[10px] font-semibold text-forest-700 hover:text-clay-600 transition-colors"
            >
              {product.categoryLabel}
            </Link>
            <div className="flex items-center gap-1 text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-xs text-forest-950">{product.rating}</span>
              <span className="text-muted-foreground text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-sm font-semibold text-forest-950 line-clamp-2 group-hover:text-forest-800 transition-colors">
            <Link to={`/product/${product.id}`}>
              {product.title}
            </Link>
          </h3>

          {/* Short description */}
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart action */}
        <div className="mt-4 pt-3 border-t border-sand-200/80 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-forest-950 tracking-tight font-sans">
              {formatPKR(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-muted-foreground line-through">
                {formatPKR(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!product.inStock || product.stockCount === 0}
            onClick={() => addToCart(product, 1)}
            className="p-2 rounded bg-sand-100 hover:bg-forest-900 hover:text-white text-forest-900 border border-sand-300 hover:border-forest-900 transition-colors duration-150 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to Campus Cart"
            aria-label={`Add ${product.title} to Cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
