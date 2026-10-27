import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService } from '@/services/productService'
import { Product } from '@/types/product'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductTabs } from '@/components/product/ProductTabs'
import { ProductCard } from '@/components/shop/ProductCard'
import { ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/common/Button'

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    let isMounted = true

    async function loadProduct() {
      if (!id) return
      try {
        const found = await productService.getProductById(id)
        if (!isMounted) return
        setProduct(found || null)

        if (found) {
          const related = await productService.getProductsByCategory(found.category)
          if (!isMounted) return
          setRelatedProducts(related.filter((p) => p.id !== found.id).slice(0, 4))
        }
      } catch (e) {
        console.warn('[UniMart] Error loading product details:', e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-forest-800 border-r-transparent mb-3" />
          <p className="text-xs text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-md border border-sand-300">
          <AlertCircle className="w-10 h-10 text-clay-600 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-forest-950">Item Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            The study item or textbook you requested could not be found or has been moved from the campus inventory.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="md">
              Return to Campus Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-background py-6 sm:py-10">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-forest-950 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-forest-950 transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-forest-950 transition-colors"
          >
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-forest-950 font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Back Link on Mobile */}
        <div className="sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-semibold text-forest-900 hover:text-clay-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to catalog</span>
          </Link>
        </div>

        {/* 2-Column Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white rounded-md border border-sand-300 p-6 sm:p-8 shadow-subtle">
          {/* Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={product.images}
              title={product.title}
              badge={product.badge}
            />
          </div>

          {/* Info & Add-to-cart */}
          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div>
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-6 border-t border-sand-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-forest-800">
                  Recommended For Your Course
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                  Related in {product.categoryLabel}
                </h3>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-semibold text-forest-900 hover:text-clay-600 transition-colors"
              >
                View category
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
