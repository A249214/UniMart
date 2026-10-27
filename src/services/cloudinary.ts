/**
 * Cloudinary Media Service for UniMart
 * Handles responsive transformations, secure HTTPS delivery, and unsigned uploads.
 * IMPORTANT: Cloudinary API Secrets are NEVER stored or referenced in frontend code.
 */

export interface CloudinaryTransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb' | 'pad'
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | number
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  gravity?: 'auto' | 'center' | 'face'
}

export interface CloudinaryUploadResponse {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
}

const DEFAULT_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'unimart-campus'
const DEFAULT_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

/**
 * Returns active Cloudinary configuration status
 */
export function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || DEFAULT_UPLOAD_PRESET
  const isUploadConfigured = Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )

  return {
    cloudName,
    uploadPreset,
    isUploadConfigured,
  }
}

/**
 * Builds an optimized, responsive Cloudinary URL with auto-format and auto-quality
 */
export function buildCloudinaryUrl(
  urlOrPublicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!urlOrPublicId) return ''

  // Fallback if not an external or Cloudinary URL
  if (urlOrPublicId.startsWith('data:') || urlOrPublicId.startsWith('blob:')) {
    return urlOrPublicId
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options

  // Construct transformation string
  const transforms: string[] = [`f_${format}`, `q_${quality}`]

  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (width || height) {
    transforms.push(`c_${crop}`)
    if (crop === 'fill' || crop === 'thumb') {
      transforms.push(`g_${gravity}`)
    }
  }

  const transformString = transforms.join(',')

  // Case 1: Already a full Cloudinary URL
  if (urlOrPublicId.includes('res.cloudinary.com')) {
    const uploadIndex = urlOrPublicId.indexOf('/upload/')
    if (uploadIndex !== -1) {
      const prefix = urlOrPublicId.substring(0, uploadIndex + 8)
      const rest = urlOrPublicId.substring(uploadIndex + 8)

      // Check if existing transformations are already present
      const firstSegment = rest.split('/')[0]
      if (firstSegment.includes('_') || firstSegment.includes(',')) {
        // Replace existing transformation segment
        const pathAfterTransform = rest.substring(firstSegment.length + 1)
        return `${prefix}${transformString}/${pathAfterTransform}`
      }

      return `${prefix}${transformString}/${rest}`
    }
    return urlOrPublicId
  }

  // Case 2: Relative Public ID (e.g. 'unimart/products/calculus')
  if (!urlOrPublicId.startsWith('http://') && !urlOrPublicId.startsWith('https://')) {
    const { cloudName } = getCloudinaryConfig()
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${urlOrPublicId}`
  }

  // Case 3: External image URL (deliver directly)
  return urlOrPublicId
}

/**
 * Generates an HTML srcset string for responsive image elements
 */
export function getCloudinarySrcSet(
  urlOrPublicId: string,
  widths: number[] = [320, 640, 960, 1280]
): string {
  if (!urlOrPublicId || !urlOrPublicId.includes('res.cloudinary.com')) {
    return ''
  }

  return widths
    .map((w) => `${buildCloudinaryUrl(urlOrPublicId, { width: w })} ${w}w`)
    .join(', ')
}

/**
 * Upload an image file directly to Cloudinary using an unsigned upload preset.
 * Safe for client-side use: NO API secret is used or required.
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'unimart/products'
): Promise<CloudinaryUploadResponse> {
  const { cloudName, uploadPreset, isUploadConfigured } = getCloudinaryConfig()

  if (!isUploadConfigured || !uploadPreset) {
    throw new Error(
      `Cloudinary upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local to enable real-time student image uploads.`
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.message || `Cloudinary upload failed with status ${response.status}`
      )
    }

    const data: CloudinaryUploadResponse = await response.json()
    return data
  } catch (error: any) {
    console.error('[Cloudinary Upload Error]', error)
    throw error
  }
}
