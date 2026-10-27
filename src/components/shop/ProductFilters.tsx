import React from 'react'
import { CATEGORIES } from '@/data/categories'
import { formatPKR } from '@/utils/formatters'
import { Filter, X, Check } from 'lucide-react'

interface ProductFiltersProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  maxPrice: number
  onChangeMaxPrice: (price: number) => void
  sortBy: string
  onChangeSortBy: (sort: string) => void
  inStockOnly?: boolean
  onToggleInStockOnly?: (val: boolean) => void
  onReset: () => void
  totalCount: number
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onChangeMaxPrice,
  sortBy,
  onChangeSortBy,
  inStockOnly = false,
  onToggleInStockOnly,
  onReset,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-md border border-sand-300 p-4 space-y-6 shadow-subtle">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest-800" />
          <h3 className="text-sm font-semibold text-forest-950 font-serif">Catalog Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-clay-600 transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Sort Items By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value)}
          className="w-full text-xs bg-sand-50 border border-sand-300 rounded px-2.5 py-2 text-forest-900 focus:outline-none focus:border-forest-700"
        >
          <option value="featured">Featured & Campus Picks</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Student Rating</option>
          <option value="discount">Biggest Student Savings</option>
          <option value="newest">New Semester Arrivals</option>
        </select>
      </div>

      {/* Category List */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-forest-900 text-ivory-50 font-semibold'
                : 'text-forest-900 hover:bg-sand-100'
            }`}
          >
            <span>All Campus Products</span>
            <span className="text-[11px] opacity-70">{totalCount}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-forest-900 text-ivory-50 font-semibold'
                    : 'text-forest-900 hover:bg-sand-100'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-sand-200" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Availability Filter */}
      {onToggleInStockOnly && (
        <div className="pt-2 border-t border-sand-200">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-forest-900">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStockOnly(e.target.checked)}
              className="rounded border-sand-300 text-forest-800 accent-forest-800 w-4 h-4 cursor-pointer"
            />
            <span className="font-medium">In Stock Only</span>
          </label>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="pt-2 border-t border-sand-200">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider text-muted-foreground">
            Max Budget
          </span>
          <span className="font-bold text-forest-950 font-sans">
            {formatPKR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="26000"
          step="500"
          value={maxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="w-full accent-forest-800 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Rs. 1,000</span>
          <span>Rs. 26,000</span>
        </div>
      </div>

      {/* Student Delivery Hub Notice */}
      <div className="p-3 bg-sand-100/60 rounded border border-sand-200 text-[11px] text-forest-800 leading-snug">
        <p className="font-semibold text-forest-950 mb-0.5">Hostel Reception Drop-off</p>
        <p className="text-muted-foreground">
          Delivered straight to campus security gates & hostel warden desks. Free delivery on orders over Rs. 2,500.
        </p>
      </div>
    </div>
  )
}
