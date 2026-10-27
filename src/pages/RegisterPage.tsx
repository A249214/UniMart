import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  GraduationCap,
  Mail,
  Lock,
  User,
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

interface RegisterErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  studentId?: string
  general?: string
}

export const RegisterPage: React.FC = () => {
  const { currentCampus, setCampusById, campuses } = useCampus()
  const { showToast } = useToast()
  const { register, loginWithDemoStudent, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [studentId, setStudentId] = useState('')
  const [degree, setDegree] = useState('BS Computer Science')
  const [residentType, setResidentType] = useState<'hostel' | 'day_scholar'>('hostel')

  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const isLiveFirebase = isFirebaseConfigured()

  // Retain intended navigation destination if redirected here from a protected page
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/orders'

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {}

    // 1. Full name validation
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      newErrors.fullName = 'Full student name is required.'
    } else if (trimmedName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters long.'
    }

    // 2. Email validation
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      newErrors.email = 'University email address is required.'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address (e.g. rollno@campus.edu.pk).'
      }
    }

    // 3. Password validation (minimum 8 characters)
    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }

    // 4. Confirm password validation (must match)
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirming your password is required.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please verify both passwords.'
    }

    // 5. Student ID validation
    if (!studentId.trim()) {
      newErrors.studentId = 'University Roll Number or Student ID is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await register({
        displayName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        university: currentCampus.name,
        campus: currentCampus.shortName,
        studentId: studentId.trim(),
        residencyType: residentType,
        roomOrDesk: residentType === 'hostel' ? 'Hostel Room' : 'Commuter Desk',
      })

      showToast(
        'Student Account Created',
        `Welcome to UniMart, ${fullName.trim()}! Your profile has been created.`,
        'success'
      )
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const errObj = err as { code?: string; message?: string }
      let message = 'Failed to register student account.'

      if (errObj?.code === 'auth/email-already-in-use') {
        message = 'This university email is already registered. Please sign in or use another email.'
      } else if (errObj?.code === 'auth/invalid-email') {
        message = 'The university email format is invalid.'
      } else if (errObj?.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 8 characters with letters and numbers.'
      } else if (errObj?.code === 'auth/operation-not-allowed' || errObj?.code === 'auth/configuration-not-found') {
        message = 'Firebase Authentication is not yet enabled in Firebase project unimart-a7aae. Please enable the Email/Password sign-in provider in Firebase Console (Build > Authentication > Sign-in method).'
      } else if (errObj?.code === 'auth/network-request-failed') {
        message = 'Network connection problem. Please verify your internet connection.'
      } else if (errObj?.message) {
        message = errObj.message
      }

      setErrors({ general: message })
      showToast('Registration Error', message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimulatedRegister = () => {
    loginWithDemoStudent()
    showToast(
      'Account Created (Demo Session)',
      `Welcome to UniMart! Logged in as demo student.`,
      'success'
    )
    navigate(from, { replace: true })
  }

  return (
    <div className="flex-1 bg-background py-12 sm:py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded bg-forest-900 text-ivory-50 flex items-center justify-center mx-auto mb-3 shadow-subtle">
            <GraduationCap className="w-6 h-6 text-sand-200" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Create Student Account
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Unlock student semester discounts, book reservations, and hostel gate delivery.
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
              {isLiveFirebase
                ? 'Firebase Auth & Firestore: Connected'
                : 'Firestore Profiles: Offline / Demo Mode'}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {isLiveFirebase ? 'Secure Auth Active' : 'Zero-Config Active'}
          </span>
        </div>

        {/* Register Card */}
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

          <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
            
            <Input
              id="register-fullname"
              label="Full Student Name"
              type="text"
              placeholder="e.g. Fatima Zahra"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }))
              }}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.fullName}
              disabled={isLoading}
              required
            />

            <div>
              <label
                htmlFor="register-campus"
                className="block text-xs font-semibold uppercase tracking-wider text-forest-900/80 mb-1.5"
              >
                University Campus
              </label>
              <select
                id="register-campus"
                value={currentCampus.id}
                onChange={(e) => setCampusById(e.target.value)}
                disabled={isLoading}
                className="w-full text-xs bg-white border border-sand-300 rounded px-3 py-2 text-forest-950 font-medium focus:outline-none focus:border-forest-700 disabled:bg-sand-100/60"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="register-studentid"
                label="Student Roll No / ID"
                type="text"
                placeholder="2023-CS-104"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value)
                  if (errors.studentId) setErrors((prev) => ({ ...prev, studentId: undefined }))
                }}
                error={errors.studentId}
                disabled={isLoading}
                required
              />
              <div>
                <label
                  htmlFor="register-degree"
                  className="block text-xs font-semibold uppercase tracking-wider text-forest-900/80 mb-1.5"
                >
                  Degree / Department
                </label>
                <input
                  id="register-degree"
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  disabled={isLoading}
                  className="w-full text-xs bg-white border border-sand-300 rounded px-3 py-2 text-forest-950 focus:outline-none focus:border-forest-700 disabled:bg-sand-100/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest-900/80 sm:col-span-2">
                Residency Status
              </label>
              <label
                className={`p-2.5 rounded border text-xs cursor-pointer flex items-center gap-2 transition-colors ${
                  residentType === 'hostel'
                    ? 'border-forest-800 bg-sand-100/70 font-semibold text-forest-950'
                    : 'border-sand-300 text-forest-900'
                }`}
              >
                <input
                  type="radio"
                  name="residency"
                  checked={residentType === 'hostel'}
                  onChange={() => setResidentType('hostel')}
                  disabled={isLoading}
                  className="accent-forest-800"
                />
                <span>On-Campus Hostel Resident</span>
              </label>
              <label
                className={`p-2.5 rounded border text-xs cursor-pointer flex items-center gap-2 transition-colors ${
                  residentType === 'day_scholar'
                    ? 'border-forest-800 bg-sand-100/70 font-semibold text-forest-950'
                    : 'border-sand-300 text-forest-900'
                }`}
              >
                <input
                  type="radio"
                  name="residency"
                  checked={residentType === 'day_scholar'}
                  onChange={() => setResidentType('day_scholar')}
                  disabled={isLoading}
                  className="accent-forest-800"
                />
                <span>Day Scholar / Commuter</span>
              </label>
            </div>

            <Input
              id="register-email"
              label="Official Student Email"
              type="email"
              placeholder="student@campus.edu.pk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              helperText="University email unlocks syllabus bulk discounts"
              disabled={isLoading}
              required
            />

            <Input
              id="register-password"
              label="Create Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              helperText="Must be at least 8 characters"
              disabled={isLoading}
              required
            />

            <Input
              id="register-confirmpassword"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account & Firestore Profile...</span>
                </span>
              ) : (
                'Complete Student Registration'
              )}
            </Button>
          </form>

          {/* Quick Demo Register Button */}
          <div className="pt-3 border-t border-sand-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSimulatedRegister}
              disabled={isLoading}
              className="w-full bg-sand-100 hover:bg-sand-200 text-forest-950 font-semibold text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-forest-700" />
              <span>Simulate Instant Registration</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="text-center pt-2 text-xs text-muted-foreground">
            Already have a registered account?{' '}
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="font-semibold text-forest-900 hover:text-clay-600 underline underline-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
          <span>Student verification protects subsidized semester textbook prices</span>
        </div>

      </div>
    </div>
  )
}
