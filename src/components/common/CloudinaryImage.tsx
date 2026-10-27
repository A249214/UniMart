import React, { useState } from 'react'
import { buildCloudinaryUrl, getCloudinarySrcSet } from '@/services/cloudinary'

export interface CloudinaryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb' | 'pad'
  priority?: boolean
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
  fallbackSrc?: string
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width,
  height,
  crop = 'fill',
  priority = false,
  aspectRatio = 'auto',
  className = '',
  fallbackSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Default fallback SVG with academic UniMart brand crest
  const defaultFallback =
    fallbackSrc ||
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f4efe7"/><g fill="%23173b28" opacity="0.35" transform="translate(160, 105)"><path d="M40 0L4 16l36 16 30-13.3V56h6V16L40 0zm0 42l-23-10.4v16.2C17 57.8 27.2 66 40 66s23-8.2 23-18.2V31.6L40 42z"/></g><text x="200" y="200" font-family="Georgia, serif" font-size="13" font-weight="600" fill="%23173b28" opacity="0.6" text-anchor="middle">UniMart Campus Essential</text></svg>`

  // Optimize URL if Cloudinary
  const optimizedSrc = hasError
    ? defaultFallback
    : buildCloudinaryUrl(src, { width, height, crop, quality: 'auto', format: 'auto' })

  const srcSet = !hasError && src?.includes('res.cloudinary.com') ? getCloudinarySrcSet(src) : undefined

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : ''

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {/* Shimmer skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-sand-200/60 animate-pulse pointer-events-none" />
      )}

      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={srcSet ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded || hasError ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  )
}
