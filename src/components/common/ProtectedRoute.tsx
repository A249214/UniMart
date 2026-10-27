import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { Loader2, GraduationCap, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

/**
 * ProtectedRoute component:
 * 1. Waits for initial Firebase auth state before redirecting (prevents flash redirects).
 * 2. Redirects unauthenticated users to /login preserving the intended destination in state.
 * 3. Renders children or Outlet if user is authenticated.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Wait for the initial Firebase Auth state to resolve before deciding
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-12 h-12 rounded bg-forest-900 text-ivory-50 flex items-center justify-center mb-4 shadow-subtle animate-pulse">
          <GraduationCap className="w-6 h-6 text-sand-200" />
        </div>
        <div className="flex items-center gap-2 text-forest-900 font-medium text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-forest-700" />
          <span>Verifying student campus credentials...</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-forest-700" />
          <span>Restricted to accredited university students</span>
        </p>
      </div>
    )
  }

  // Not authenticated: redirect to login preserving from location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Authenticated: render protected route contents
  return children ? <>{children}</> : <Outlet />
}
