import React from 'react'

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-md border border-sand-300 p-0 overflow-hidden animate-pulse shadow-subtle flex flex-col">
      {/* Image Skeleton */}
      <div className="aspect-4/3 sm:aspect-square bg-sand-200/70" />
      
      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-sand-200 rounded" />
            <div className="h-3 w-10 bg-sand-200 rounded" />
          </div>
          <div className="h-4 w-4/5 bg-sand-200 rounded" />
          <div className="h-3 w-full bg-sand-100 rounded" />
          <div className="h-3 w-2/3 bg-sand-100 rounded" />
        </div>

        <div className="pt-3 border-t border-sand-200/80 flex items-center justify-between">
          <div className="h-5 w-20 bg-sand-200 rounded" />
          <div className="h-8 w-8 bg-sand-200 rounded" />
        </div>
      </div>
    </div>
  )
}
