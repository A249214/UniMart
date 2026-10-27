import React, { useState } from 'react'
import {
  Database,
  Cloud,
  CheckCircle2,
  X,
  Upload,
  RefreshCw,
  Info,
  Shield,
} from 'lucide-react'
import { isFirebaseConfigured, firebaseConfig } from '@/services/firebase'
import { getCloudinaryConfig, uploadImageToCloudinary } from '@/services/cloudinary'
import { seedProductsToFirestore } from '@/services/seedService'
import { Button } from './Button'
import { useToast } from '@/context/ToastContext'

interface BackendStatusModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ url: string; publicId: string } | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { showToast } = useToast()

  if (!isOpen) return null

  const firebaseReady = isFirebaseConfigured()
  const { cloudName, uploadPreset, isUploadConfigured } = getCloudinaryConfig()

  const handleRunSeed = async () => {
    setIsSeeding(true)
    setSeedResult(null)
    try {
      const res = await seedProductsToFirestore(true)
      if (res.success) {
        setSeedResult(`Success: ${res.message}`)
        showToast('Firestore Seed Complete', res.message, 'success')
      } else {
        setSeedResult(`Notice: ${res.message}`)
        showToast('Firestore Notice', res.message, 'warning')
      }
    } catch (err: any) {
      setSeedResult(`Error: ${err.message}`)
    } finally {
      setIsSeeding(false)
    }
  }

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadResult(null)
    setUploadError(null)

    try {
      const res = await uploadImageToCloudinary(file)
      setUploadResult({
        url: res.secure_url,
        publicId: res.public_id,
      })
      showToast('Cloudinary Upload Verified', `Uploaded asset: ${res.public_id}`, 'success')
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
      showToast('Cloudinary Upload Error', err.message, 'warning')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-md border border-sand-300 shadow-elevated p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-forest-800" />
            <h3 className="font-serif text-lg font-bold text-forest-950">
              Backend & Media Services Status
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-forest-950"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Firebase Status */}
        <div className="p-4 rounded border bg-sand-50/60 border-sand-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-forest-800" />
              <span className="font-semibold text-xs text-forest-950">Firebase Authentication & Cloud Firestore</span>
            </div>
            {firebaseReady ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Live: {firebaseConfig.projectId}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                <Info className="w-3 h-3" /> Offline / Local Mode
              </span>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {firebaseReady
              ? 'Active Firebase project credentials detected in environment variables.'
              : 'Operating with documented sample products fallback. Add VITE_FIREBASE_API_KEY in .env.local to link live Firebase project.'}
          </p>

          {/* Seed Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-sand-200">
            <span className="text-xs text-forest-900 font-medium">Seed 17 Products to Firestore:</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRunSeed}
              isLoading={isSeeding}
              leftIcon={<RefreshCw className="w-3 h-3 mr-1" />}
              className="text-xs"
            >
              Seed Firestore Now
            </Button>
          </div>
          {seedResult && (
            <p className="text-[11px] font-mono p-2 bg-white rounded border border-sand-300 text-forest-900 break-words">
              {seedResult}
            </p>
          )}
        </div>

        {/* Cloudinary Status */}
        <div className="p-4 rounded border bg-sand-50/60 border-sand-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-forest-800" />
              <span className="font-semibold text-xs text-forest-950">Cloudinary Media Delivery</span>
            </div>
            {isUploadConfigured ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sand-800 bg-sand-200 px-2 py-0.5 rounded">
                Preset Optional
              </span>
            )}
          </div>

          <div className="text-[11px] space-y-1 text-muted-foreground font-mono">
            <p>Cloud Name: <strong className="text-forest-950">{cloudName}</strong></p>
            <p>Upload Preset: <strong className="text-forest-950">{uploadPreset || '(Unset — using verified static assets)'}</strong></p>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All product images and banners are delivered via secure HTTPS Cloudinary transformations with automatic format (`f_auto`) and quality (`q_auto`).
          </p>

          {/* Test Image Upload */}
          <div className="pt-2 border-t border-sand-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-900 font-medium">Test Unsigned Upload:</span>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-forest-900 text-white text-xs font-semibold hover:bg-forest-950 transition-colors">
                  <Upload className="w-3 h-3" />
                  <span>Choose Test Image</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTestUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {uploading && (
              <p className="text-xs text-forest-800 animate-pulse">Uploading to Cloudinary...</p>
            )}

            {uploadResult && (
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <p className="font-bold">Upload Succeeded!</p>
                <p className="text-[10px] truncate font-mono text-emerald-800">{uploadResult.url}</p>
                <img src={uploadResult.url} alt="Uploaded test preview" className="w-16 h-16 object-cover rounded mt-1 border" />
              </div>
            )}

            {uploadError && (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-950 space-y-1">
                <p className="font-semibold text-amber-900">Upload Information:</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">{uploadError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Summary */}
        <div className="p-3 bg-forest-950 text-sand-100 rounded text-xs flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-sand-300 leading-relaxed">
            <strong className="text-white">Security Assured:</strong> Cloudinary API secrets are never bundled in client code. Firestore Security Rules in <code className="text-clay-300">firestore.rules</code> reject unauthorized writes to products.
          </p>
        </div>

        {/* Close CTA */}
        <div className="pt-2 text-right">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Status
          </Button>
        </div>

      </div>
    </div>
  )
}
