import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PAKISTANI_CAMPUSES, UniversityCampus } from '@/data/campuses'

interface CampusContextType {
  currentCampus: UniversityCampus
  setCampusById: (campusId: string) => void
  campuses: UniversityCampus[]
}

const CampusContext = createContext<CampusContextType | undefined>(undefined)

const CAMPUS_STORAGE_KEY = 'unimart_selected_campus'

export const CampusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCampus, setCurrentCampus] = useState<UniversityCampus>(() => {
    try {
      const saved = localStorage.getItem(CAMPUS_STORAGE_KEY)
      if (saved) {
        const found = PAKISTANI_CAMPUSES.find((c) => c.id === saved)
        if (found) return found
      }
    } catch (e) {
      console.warn('Could not read campus from localStorage', e)
    }
    return PAKISTANI_CAMPUSES[0] // Default: NUST Islamabad
  })

  useEffect(() => {
    try {
      localStorage.setItem(CAMPUS_STORAGE_KEY, currentCampus.id)
    } catch (e) {
      console.warn('Could not persist campus to localStorage', e)
    }
  }, [currentCampus])

  const setCampusById = (campusId: string) => {
    const found = PAKISTANI_CAMPUSES.find((c) => c.id === campusId)
    if (found) {
      setCurrentCampus(found)
    }
  }

  return (
    <CampusContext.Provider value={{ currentCampus, setCampusById, campuses: PAKISTANI_CAMPUSES }}>
      {children}
    </CampusContext.Provider>
  )
}

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext)
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider')
  }
  return context
}
