import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Active Firebase Configuration for UniMart (unimart-a7aae)
 * Supports environment variables with authoritative fallbacks.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBbxOroDs0Y_gJBZP3tG1IlwcTrX6lYP_g',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'unimart-a7aae.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'unimart-a7aae',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'unimart-a7aae.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '610868778538',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:610868778538:web:8ef652fb48a1bcfb965553',
}

/**
 * Collection Name Constants
 */
export const COLLECTIONS = {
  PRODUCTS: 'products',
  USERS: 'users',
  ORDERS: 'orders',
  CART_ITEMS: 'cartItems',
} as const

/**
 * Checks if live Firebase project credentials have been configured
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.apiKey !== 'unimart-offline-demo-key'
  )
}

// Initialize singletons
let app: FirebaseApp
let auth: Auth
let db: Firestore

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
} catch (error) {
  console.warn(
    '[UniMart Firebase] Initialization fallback engaged:',
    error
  )
  app = !getApps().length
    ? initializeApp({
        apiKey: 'unimart-offline-demo-key',
        authDomain: 'unimart-a7aae.firebaseapp.com',
        projectId: 'unimart-a7aae',
        appId: '1:610868778538:web:8ef652fb48a1bcfb965553',
      })
    : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }

