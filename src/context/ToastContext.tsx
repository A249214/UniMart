import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'phase2'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: ToastType
}

interface ToastContextType {
  toasts: ToastItem[]
  showToast: (title: string, description?: string, type?: ToastType) => void
  showPhase2Notice: (featureName: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const newToast: ToastItem = { id, title, description, type }

      setToasts((prev) => [...prev, newToast])

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id)
      }, 4000)
    },
    [removeToast]
  )

  const showPhase2Notice = useCallback(
    (featureName: string) => {
      showToast(
        `${featureName} — Backend Service Notice`,
        'Authentication and live transactions are connected to Firebase Firestore with offline simulation fallback.',
        'info'
      )
    },
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, showPhase2Notice, removeToast }}>
      {children}
      {/* Toast Render Portal */}
      <div
        aria-live="assertive"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const isPhase2 = toast.type === 'phase2'
          const isSuccess = toast.type === 'success'
          const isWarning = toast.type === 'warning'
          const isError = toast.type === 'error'

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-lg border p-4 shadow-elevated transition-all duration-200 transform translate-y-0 ${
                isError
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : isPhase2
                  ? 'bg-sand-50 border-clay-300 text-forest-950'
                  : isSuccess
                  ? 'bg-white border-forest-300 text-forest-900'
                  : isWarning
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-white border-sand-300 text-forest-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isError ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-forest-600" />
                  ) : isPhase2 ? (
                    <span className="w-5 h-5 rounded-full bg-clay-100 text-clay-700 flex items-center justify-center text-xs font-bold">
                      P3
                    </span>
                  ) : isWarning ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Info className="w-5 h-5 text-forest-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground">{toast.title}</h4>
                  {toast.description && (
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {toast.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 rounded hover:bg-sand-200/50 text-muted-foreground hover:text-foreground"
                  aria-label="Close toast"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
