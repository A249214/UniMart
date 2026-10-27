import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { UserProfile } from '@/types/user'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { isFirebaseConfigured } from '@/services/firebase'

export interface RegisterData {
  displayName: string
  email: string
  password: string
  confirmPassword?: string
  university?: string
  campus?: string
  studentId?: string
  residencyType?: 'hostel' | 'day_scholar'
  roomOrDesk?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  isDemoUser: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  loginWithDemoStudent: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_STORAGE_KEY = 'unimart_demo_session'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoUser, setIsDemoUser] = useState(false)

  // Load Firestore profile for a Firebase Auth user
  const loadProfile = useCallback(async (firebaseUser: User) => {
    try {
      const profile = await userService.getUserProfile(firebaseUser.uid)
      if (profile) {
        setUserProfile(profile)
      } else {
        // Fallback profile if Firestore read returns null
        const fallbackProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'University Student',
          university: 'National University of Computer & Emerging Sciences',
          campus: 'FAST-NUCES Islamabad',
          studentId: '21I-0482',
          role: 'student',
          residencyType: 'hostel',
          createdAt: new Date().toISOString(),
        }
        setUserProfile(fallbackProfile)
      }
    } catch (e) {
      console.warn('[UniMart AuthContext] Could not load Firestore profile:', e)
    }
  }, [])

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    let unsubscribe = () => {}

    if (isFirebaseConfigured()) {
      unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser)
          setIsDemoUser(false)
          localStorage.removeItem(DEMO_STORAGE_KEY)
          await loadProfile(firebaseUser)
        } else {
          // Check for local demo session
          const demoSession = localStorage.getItem(DEMO_STORAGE_KEY)
          if (demoSession) {
            try {
              const parsed = JSON.parse(demoSession)
              setUserProfile(parsed)
              setIsDemoUser(true)
            } catch {
              setUser(null)
              setUserProfile(null)
            }
          } else {
            setUser(null)
            setUserProfile(null)
          }
        }
        setLoading(false)
      })
    } else {
      // In offline/demo mode, restore demo session if available
      const demoSession = localStorage.getItem(DEMO_STORAGE_KEY)
      if (demoSession) {
        try {
          const parsed = JSON.parse(demoSession)
          setUserProfile(parsed)
          setIsDemoUser(true)
        } catch {
          setUserProfile(null)
        }
      }
      setLoading(false)
    }

    return () => {
      unsubscribe()
    }
  }, [loadProfile])

  /**
   * Log in with university email and password
   */
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      if (!isFirebaseConfigured()) {
        // Offline demo login fallback
        const demoProfile: UserProfile = {
          uid: `demo-${Date.now()}`,
          email,
          displayName: email.split('@')[0] || 'University Student',
          university: 'FAST-NUCES Islamabad',
          campus: 'Islamabad Campus',
          studentId: '21I-0482',
          role: 'student',
          residencyType: 'hostel',
          createdAt: new Date().toISOString(),
        }
        setUserProfile(demoProfile)
        setIsDemoUser(true)
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoProfile))
        return
      }

      const loggedInUser = await authService.signIn(email, password)
      setUser(loggedInUser)
      setIsDemoUser(false)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      await loadProfile(loggedInUser)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Register a new student account
   * Role is strictly enforced as 'student' - no privilege escalation
   */
  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true)
    try {
      if (!isFirebaseConfigured()) {
        // Offline demo register fallback
        const demoProfile: UserProfile = {
          uid: `demo-${Date.now()}`,
          email: data.email,
          displayName: data.displayName,
          university: data.university || 'FAST-NUCES Islamabad',
          campus: data.campus || 'Islamabad Campus',
          studentId: data.studentId || '2023-CS-104',
          role: 'student', // strictly 'student'
          residencyType: data.residencyType || 'hostel',
          roomOrDesk: data.roomOrDesk,
          phone: data.phone,
          createdAt: new Date().toISOString(),
        }
        setUserProfile(demoProfile)
        setIsDemoUser(true)
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoProfile))
        return
      }

      const newUser = await authService.signUp(data.email, data.password, {
        displayName: data.displayName,
        university: data.university || 'Accredited University',
        campus: data.campus || 'Main Campus',
        studentId: data.studentId || 'N/A',
        residencyType: data.residencyType || 'hostel',
        roomOrDesk: data.roomOrDesk,
        phone: data.phone,
      })

      const immediateProfile: UserProfile = {
        uid: newUser.uid,
        email: data.email,
        displayName: data.displayName,
        university: data.university || 'FAST-NUCES Islamabad',
        campus: data.campus || 'Islamabad Campus',
        studentId: data.studentId || 'N/A',
        role: 'student',
        residencyType: data.residencyType || 'hostel',
        roomOrDesk: data.roomOrDesk,
        phone: data.phone,
        createdAt: new Date().toISOString(),
      }

      setUser(newUser)
      setUserProfile(immediateProfile)
      setIsDemoUser(false)
      localStorage.removeItem(DEMO_STORAGE_KEY)
      await loadProfile(newUser)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Log out of current session
   */
  const logout = async (): Promise<void> => {
    setLoading(true)
    try {
      if (isFirebaseConfigured()) {
        await authService.signOut()
      }
      setUser(null)
      setUserProfile(null)
      setIsDemoUser(false)
      localStorage.removeItem(DEMO_STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fast Demo Student shortcut for zero-config demonstration
   */
  const loginWithDemoStudent = (): void => {
    const demoProfile: UserProfile = {
      uid: 'demo-student-hamza',
      email: 'hamza.tariq@nu.edu.pk',
      displayName: 'Hamza Tariq',
      university: 'FAST-NUCES Islamabad',
      campus: 'Islamabad Campus',
      studentId: '21I-0482',
      role: 'student',
      residencyType: 'hostel',
      roomOrDesk: 'Hostel 4 / Room 204',
      phone: '0300-1234567',
      createdAt: new Date().toISOString(),
    }
    setUserProfile(demoProfile)
    setIsDemoUser(true)
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoProfile))
  }

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await loadProfile(user)
    }
  }

  const isAuthenticated = Boolean(user || isDemoUser)

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated,
        isDemoUser,
        login,
        register,
        logout,
        refreshProfile,
        loginWithDemoStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
