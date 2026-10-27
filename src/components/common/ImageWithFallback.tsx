import React, { useState } from 'react'
import { buildCloudinaryUrl, getCloudinarySrcSet } from '@/services/cloudinary'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  alt: string
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb' | 'pad'
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  crop = 'fill',
  className = '',
  fallbackSrc,
  ...props
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Default fallback SVG data URI with academic UniMart crest aesthetic
  const defaultFallback =
    fallbackSrc ||
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f4efe7"/><g fill="%23173b28" opacity="0.4" transform="translate(160, 105)"><path d="M40 0L4 16l36 16 30-13.3V56h6V16L40 0zm0 42l-23-10.4v16.2C17 57.8 27.2 66 40 66s23-8.2 23-18.2V31.6L40 42z"/></g><text x="200" y="200" font-family="Georgia, serif" font-size="13" font-weight="600" fill="%23173b28" opacity="0.6" text-anchor="middle">UniMart Campus Essential</text></svg>`

  const optimizedSrc = hasError
    ? defaultFallback
    : src
    ? buildCloudinaryUrl(src, { width, height, crop, quality: 'auto', format: 'auto' })
    : defaultFallback

  const srcSet = !hasError && src?.includes('res.cloudinary.com') ? getCloudinarySrcSet(src) : undefined

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      alt={alt}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoaded(true)}
      className={`${className} transition-opacity duration-300 ${
        isLoaded || hasError ? 'opacity-100' : 'opacity-80'
      }`}
      loading="lazy"
      {...props}
    />
  )
}
