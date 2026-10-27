import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'
import { userService } from './userService'
import { UserProfile } from '@/types/user'

/**
 * Authentication Service for UniMart
 * Wraps Firebase Auth with university student profile creation.
 */
export const authService = {
  /**
   * Listen to Firebase Auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!auth) {
      callback(null)
      return () => {}
    }
    return onAuthStateChanged(auth, callback)
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    return auth?.currentUser || null
  },

  /**
   * Sign in with student email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    if (!auth || !isFirebaseConfigured()) {
      throw new Error(
        'Firebase Auth is running in offline demo mode. Configure your VITE_FIREBASE_API_KEY in .env.local to enable live credentials.'
      )
    }

    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  },

  /**
   * Register a new student account and create Firestore profile
   */
  async signUp(
    email: string,
    password: string,
    profileData: {
      displayName: string
      university: string
      campus: string
      studentId: string
      residencyType: 'hostel' | 'day_scholar'
      roomOrDesk?: string
      phone?: string
    }
  ): Promise<User> {
    if (!auth || !isFirebaseConfigured()) {
      throw new Error(
        'Firebase Auth is running in offline demo mode. Configure your VITE_FIREBASE_API_KEY in .env.local to enable live registration.'
      )
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const user = credential.user

    // Update Firebase Auth profile
    await updateProfile(user, {
      displayName: profileData.displayName,
    })

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: profileData.displayName,
      university: profileData.university,
      campus: profileData.campus,
      studentId: profileData.studentId,
      role: 'student',
      residencyType: profileData.residencyType,
      roomOrDesk: profileData.roomOrDesk || '',
      phone: profileData.phone || '',
      createdAt: new Date().toISOString(),
    }

    try {
      await userService.createOrUpdateUserProfile(user.uid, userProfile)
    } catch (profileErr) {
      console.warn(
        '[UniMart AuthService] User created in Firebase Auth, but Firestore profile sync was deferred:',
        profileErr
      )
    }

    return user
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (auth) {
      await signOut(auth)
    }
  },
}
