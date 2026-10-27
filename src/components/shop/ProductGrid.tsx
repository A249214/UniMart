import React from 'react'
import { Product } from '@/types/product'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { ShoppingBag, AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/common/Button'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  error?: string | null
  onResetFilters?: () => void
  onRetry?: () => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  onResetFilters,
  onRetry,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-md border border-sand-300 shadow-subtle">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4 border border-red-200">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="font-serif text-lg font-bold text-forest-950">
          Unable to Load Campus Products
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {error || 'A temporary network hiccup prevented us from loading the university catalog.'}
        </p>
        {onRetry && (
          <div className="mt-5">
            <Button
              variant="primary"
              size="sm"
              onClick={onRetry}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 mr-1" />}
            >
              Retry Connection
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-md border border-sand-300 shadow-subtle">
        <div className="w-14 h-14 rounded-full bg-sand-100 text-forest-800 mx-auto flex items-center justify-center mb-4">
          <ShoppingBag className="w-7 h-7 text-forest-700" />
        </div>
        <h3 className="font-serif text-lg font-bold text-forest-950">
          No matching campus items found
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
          We couldn't find any textbooks, notebooks, tech accessories, or student bundles matching your active filters.
        </p>
        {onResetFilters && (
          <div className="mt-5">
            <Button variant="secondary" size="sm" onClick={onResetFilters}>
              Reset Active Filters
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Active Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
