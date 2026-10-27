import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db, COLLECTIONS, isFirebaseConfigured } from './firebase'
import { UserProfile } from '@/types/user'
import { CampusAddress } from '@/types/order'

export const userService = {
  /**
   * Fetch student user profile from Firestore 'users' collection
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db || !isFirebaseConfigured()) {
      return null
    }

    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile
      }
      return null
    } catch (error) {
      console.warn('[UniMart UserService] Error fetching profile:', error)
      return null
    }
  },

  /**
   * Create or update user profile document
   */
  async createOrUpdateUserProfile(
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    if (!db || !isFirebaseConfigured()) {
      console.info('[UniMart UserService] Offline mode: profile update skipped.')
      return
    }

    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      
      // Strip undefined properties because Firestore strictly rejects undefined values
      const cleanData: Record<string, any> = {}
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          cleanData[key] = value
        }
      }

      await setDoc(
        docRef,
        {
          ...cleanData,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )
    } catch (error) {
      console.error('[UniMart UserService] Error saving profile:', error)
      throw error
    }
  },

  /**
   * Update hostel / campus address preferences
   */
  async updateCampusAddress(
    uid: string,
    address: Partial<CampusAddress>
  ): Promise<void> {
    if (!db || !isFirebaseConfigured()) return

    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid)
      const cleanUpdate: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      }
      if (address.university !== undefined) cleanUpdate.university = address.university
      if (address.campus !== undefined) cleanUpdate.campus = address.campus
      if (address.roomOrDesk !== undefined) cleanUpdate.roomOrDesk = address.roomOrDesk
      if (address.contactPhone !== undefined) cleanUpdate.phone = address.contactPhone

      await updateDoc(docRef, cleanUpdate)
    } catch (error) {
      console.error('[UniMart UserService] Error updating address:', error)
      throw error
    }
  },
}
