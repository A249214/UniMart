import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '@/services/productService'
import { Product } from '@/types/product'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { CATEGORIES, normalizeCategory } from '@/data/categories'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/common/Button'

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = normalizeCategory(searchParams.get('category') || 'all')
  const initialQuery = searchParams.get('q') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [searchInput, setSearchInput] = useState<string>(initialQuery)
  const [maxPrice, setMaxPrice] = useState<number>(26000)
  const [sortBy, setSortBy] = useState<string>('featured')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Keep state in sync with URL search params if they change
  useEffect(() => {
    const rawCat = searchParams.get('category') || 'all'
    const cat = normalizeCategory(rawCat)
    const q = searchParams.get('q') || ''
    setSelectedCategory(cat)
    setSearchQuery(q)
    setSearchInput(q)
  }, [searchParams])

  // Fetch and filter products
  const loadProducts = useCallback(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    productService
      .filterProducts({
        category: selectedCategory,
        query: searchQuery,
        sortBy: sortBy as any,
        maxPrice,
        inStockOnly,
      })
      .then((data) => {
        if (isMounted) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((_err) => {
        if (isMounted) {
          setError('Failed to fetch university store products. Please try again.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [selectedCategory, searchQuery, sortBy, maxPrice, inStockOnly])

  useEffect(() => {
    const cleanup = loadProducts()
    return cleanup
  }, [loadProducts])

  const handleSelectCategory = (cat: string) => {
    const normalized = normalizeCategory(cat)
    setSelectedCategory(normalized)
    const newParams = new URLSearchParams(searchParams)
    if (normalized === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', normalized)
    }
    setSearchParams(newParams)
    setIsMobileFiltersOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
    const newParams = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      newParams.set('q', searchInput.trim())
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams)
  }

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSearchInput('')
    setMaxPrice(26000)
    setSortBy('featured')
    setInStockOnly(false)
    setSearchParams({})
  }

  // Active category metadata if selected
  const activeCategoryMeta = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === selectedCategory || c.id === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="flex-1 bg-background py-8">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="bg-white rounded-md border border-sand-300 p-6 mb-8 shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-forest-800 bg-sand-100 px-2.5 py-0.5 rounded border border-sand-300">
                  UniMart Campus Store
                </span>
                {activeCategoryMeta && (
                  <span className="text-xs font-semibold text-clay-700 bg-clay-50 px-2 py-0.5 rounded border border-clay-200">
                    {activeCategoryMeta.itemCount}+ verified items
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
                {activeCategoryMeta ? activeCategoryMeta.label : 'All Academic & Campus Gear'}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                {activeCategoryMeta
                  ? activeCategoryMeta.description
                  : 'HEC-aligned textbooks, engineering notebooks, water-resistant laptop backpacks, and focused tech accessories for student life.'}
              </p>
            </div>

            {/* Quick stats and Mobile Filter toggle */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              <span className="text-xs text-muted-foreground bg-sand-50 px-3 py-1.5 rounded border border-sand-200">
                Showing <strong>{products.length}</strong> {products.length === 1 ? 'item' : 'items'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-1.5"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-forest-800" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* In-Catalog Search Bar Row */}
          <div className="mt-5 pt-4 border-t border-sand-200">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by book title, subject, brand, or SKU..."
                  className="w-full bg-sand-50/70 text-xs text-forest-950 placeholder:text-forest-800/40 rounded border border-sand-300 pl-8 pr-8 py-2 focus:outline-none focus:bg-white focus:border-forest-700"
                />
                <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      setSearchQuery('')
                      const p = new URLSearchParams(searchParams)
                      p.delete('q')
                      setSearchParams(p)
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-forest-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Button type="submit" variant="secondary" size="sm" className="px-3 py-1.5 text-xs">
                Search
              </Button>
            </form>
          </div>

          {/* Active Search & Category Filter Pills */}
          {(searchQuery || selectedCategory !== 'all' || maxPrice < 26000 || inStockOnly) && (
            <div className="mt-3 pt-3 border-t border-sand-200/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground font-semibold">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 text-forest-900 rounded border border-sand-300">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchInput('')
                      const p = new URLSearchParams(searchParams)
                      p.delete('q')
                      setSearchParams(p)
                    }}
                  >
                    <X className="w-3 h-3 ml-1 hover:text-clay-600" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 text-forest-900 rounded border border-sand-300">
                  Category: {activeCategoryMeta?.label}
                  <button onClick={() => handleSelectCategory('all')}>
                    <X className="w-3 h-3 ml-1 hover:text-clay-600" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 text-forest-900 rounded border border-sand-300">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 ml-1 hover:text-clay-600" />
                  </button>
                </span>
              )}

              {maxPrice < 26000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-100 text-forest-900 rounded border border-sand-300">
                  Budget ≤ Rs. {maxPrice.toLocaleString()}
                  <button onClick={() => setMaxPrice(26000)}>
                    <X className="w-3 h-3 ml-1 hover:text-clay-600" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-clay-700 hover:underline font-semibold ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Layout: Sidebar Filters & Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <ProductFilters
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              maxPrice={maxPrice}
              onChangeMaxPrice={setMaxPrice}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={setInStockOnly}
              onReset={handleResetFilters}
              totalCount={products.length}
            />
          </div>

          {/* Mobile Filter Modal/Drawer */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs bg-white h-full p-4 overflow-y-auto shadow-elevated flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
                    <h3 className="font-serif font-bold text-forest-950">Filter Products</h3>
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="p-1 rounded text-muted-foreground hover:text-forest-950"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <ProductFilters
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    maxPrice={maxPrice}
                    onChangeMaxPrice={setMaxPrice}
                    sortBy={sortBy}
                    onChangeSortBy={setSortBy}
                    inStockOnly={inStockOnly}
                    onToggleInStockOnly={setInStockOnly}
                    onReset={handleResetFilters}
                    totalCount={products.length}
                  />
                </div>
                <div className="pt-4 mt-4 border-t border-sand-200">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid - Right side */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              isLoading={loading}
              error={error}
              onResetFilters={handleResetFilters}
              onRetry={loadProducts}
            />
          </div>

        </div>

      </div>
    </div>
  )
}
