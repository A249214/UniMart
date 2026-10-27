import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  GraduationCap,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { useToast } from '@/context/ToastContext'
import { useCampus } from '@/context/CampusContext'
import { useAuth } from '@/context/AuthContext'
import { isFirebaseConfigured } from '@/services/firebase'

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const { currentCampus } = useCampus()
  const { login, loginWithDemoStudent, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isLiveFirebase = isFirebaseConfigured()

  // Determine redirect destination (e.g. page user attempted to access before redirect)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/orders'

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}
    const trimmedEmail = email.trim()

    // Email validation
    if (!trimmedEmail) {
      newErrors.email = 'University email or student ID is required.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address (e.g. student@nu.edu.pk).'
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await login(email.trim(), password)

      showToast(
        'Student Authentication Verified',
        `Welcome back! Authenticated session active for ${currentCampus.shortName}.`,
        'success'
      )
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const errObj = err as { code?: string; message?: string }
      let message = 'Failed to authenticate. Please check your credentials.'

      if (
        errObj?.code === 'auth/invalid-credential' ||
        errObj?.code === 'auth/user-not-found' ||
        errObj?.code === 'auth/wrong-password'
      ) {
        message = 'Invalid university email or password. Please verify your credentials.'
      } else if (errObj?.code === 'auth/invalid-email') {
        message = 'The university email address is poorly formatted.'
      } else if (errObj?.code === 'auth/user-disabled') {
        message = 'This student account has been disabled. Please contact your campus IT desk.'
      } else if (errObj?.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Access is temporarily throttled for security.'
      } else if (errObj?.code === 'auth/network-request-failed') {
        message = 'Network connection problem. Please check your internet connection.'
      } else if (errObj?.code === 'auth/configuration-not-found' || errObj?.code === 'auth/operation-not-allowed') {
        message = 'Firebase Authentication is not yet enabled in Firebase project unimart-a7aae. Please enable the Email/Password sign-in provider in Firebase Console (Build > Authentication > Sign-in method).'
      } else if (errObj?.message) {
        message = errObj.message
      }

      setErrors({ general: message })
      showToast('Authentication Error', message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    loginWithDemoStudent()
    showToast(
      'Demo Student Session Active',
      `Logged in as Hamza Tariq (${currentCampus.shortName}). Redirecting to campus orders...`,
      'success'
    )
    navigate(from, { replace: true })
  }

  return (
    <div className="flex-1 bg-background py-12 sm:py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded bg-forest-900 text-ivory-50 flex items-center justify-center mx-auto mb-3 shadow-subtle">
            <GraduationCap className="w-6 h-6 text-sand-200" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Student Portal Sign In
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access your university textbook orders and hostel delivery status.
          </p>
        </div>

        {/* Backend Status Strip */}
        <div
          className={`mb-6 p-3 rounded-md border text-xs flex items-center justify-between gap-2.5 ${
            isLiveFirebase
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-sand-100/90 border-sand-300 text-forest-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveFirebase ? 'bg-emerald-600 animate-ping' : 'bg-amber-600'
              }`}
            />
            <span className="font-semibold text-[11px] uppercase tracking-wider">
              {isLiveFirebase ? 'Firebase Auth: Connected' : 'Firebase Auth: Offline / Demo Mode'}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {isLiveFirebase ? 'Live Credentials' : 'Zero-Config Active'}
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-md border border-sand-300 p-6 sm:p-8 shadow-subtle space-y-5">
          {errors.general && (
            <div
              className="p-3.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2.5"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errors.general}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
            <Input
              id="student-email"
              label="University Email"
              type="email"
              placeholder="e.g. 21i-0482@nu.edu.pk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              disabled={isLoading}
              required
            />

            <Input
              id="student-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              helperText="Minimum 8 characters"
              disabled={isLoading}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-sand-300 text-forest-800 accent-forest-800"
                  defaultChecked
                />
                <span>Remember campus session</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Password Recovery',
                    'Contact your campus IT helpdesk or use Firebase password recovery to reset student access.',
                    'info'
                  )
                }
                className="text-clay-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                'Sign In with Student Credentials'
              )}
            </Button>
          </form>

          {/* Quick Demo Student Shortcut */}
          <div className="pt-4 border-t border-sand-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-sand-100 hover:bg-sand-200 text-forest-950 font-semibold text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-forest-700" />
              <span>Continue with Demo Student Account</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="text-center pt-2 text-xs text-muted-foreground">
            Don&apos;t have a student account yet?{' '}
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              className="font-semibold text-forest-900 hover:text-clay-600 underline underline-offset-2"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
          <span>Restricted to accredited university students in Pakistan</span>
        </div>

      </div>
    </div>
  )
}
