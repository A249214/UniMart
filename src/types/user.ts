export type UserRole = 'student' | 'admin' | 'campus_ambassador'

export type ResidencyType = 'hostel' | 'day_scholar'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  university: string
  campus: string
  studentId: string
  role: UserRole
  residencyType: ResidencyType
  roomOrDesk?: string
  phone?: string
  photoURL?: string
  createdAt: string
  updatedAt?: string
}
