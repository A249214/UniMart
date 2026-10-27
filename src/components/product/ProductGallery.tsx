import React, { useState } from 'react'
import { Badge } from '@/components/common/Badge'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'

interface ProductGalleryProps {
  images: string[]
  title: string
  badge?: string
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title, badge }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main showcase image */}
      <div className="relative aspect-4/3 sm:aspect-square bg-white rounded-md border border-sand-300 shadow-subtle overflow-hidden">
        <ImageWithFallback
          src={images[activeImageIndex] || images[0]}
          alt={title}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />
        {badge && (
          <div className="absolute top-4 left-4">
            <Badge variant="clay" className="shadow-xs text-xs font-semibold px-3 py-1">
              {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-20 h-20 rounded border overflow-hidden shrink-0 transition-all ${
                activeImageIndex === idx
                  ? 'border-forest-800 ring-2 ring-forest-800/30'
                  : 'border-sand-300 hover:border-sand-400 opacity-70 hover:opacity-100'
              }`}
            >
              <ImageWithFallback
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
