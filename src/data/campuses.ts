export interface UniversityCampus {
  id: string
  name: string
  shortName: string
  city: string
  popularDeliveryPoints: string[]
}

export const PAKISTANI_CAMPUSES: UniversityCampus[] = [
  {
    id: 'nust-isb',
    name: 'National University of Sciences & Technology (NUST)',
    shortName: 'NUST Islamabad',
    city: 'Islamabad',
    popularDeliveryPoints: ['H-12 Main Gate Reception', 'Liaquat Boys Hostel', 'Fatima Girls Hostel', 'SEECS Cafe Counter', 'SCME Academic Block']
  },
  {
    id: 'lums-lhr',
    name: 'Lahore University of Management Sciences (LUMS)',
    shortName: 'LUMS Lahore',
    city: 'Lahore',
    popularDeliveryPoints: ['PDC Student Center', 'Suleman Dawood School (SDSB)', 'Male Hostel M-3', 'Female Hostel F-2', 'Library Reception']
  },
  {
    id: 'fast-isb',
    name: 'FAST-NUCES Islamabad Campus',
    shortName: 'FAST Islamabad',
    city: 'Islamabad',
    popularDeliveryPoints: ['A-Block Student Affairs', 'B-Block Courtyard', 'CS Department Reception', 'Main Gate Security Office']
  },
  {
    id: 'fast-lhr',
    name: 'FAST-NUCES Lahore Campus',
    shortName: 'FAST Lahore',
    city: 'Lahore',
    popularDeliveryPoints: ['Faisal Town Main Gate', 'Cafeteria Lawn', 'Civil Engineering Block', 'CS Lab Complex']
  },
  {
    id: 'fast-khi',
    name: 'FAST-NUCES Karachi Campus',
    shortName: 'FAST Karachi',
    city: 'Karachi',
    popularDeliveryPoints: ['Shah Latif Town Reception', 'City Campus Student Lounge', 'Electrical Engineering Foyer']
  },
  {
    id: 'iba-khi',
    name: 'Institute of Business Administration (IBA)',
    shortName: 'IBA Karachi',
    city: 'Karachi',
    popularDeliveryPoints: ['Main Campus (University Road) Gate 2', 'City Campus Garden', 'Aman CED Building', 'Boys Hostel Reception']
  },
  {
    id: 'giki-topi',
    name: 'Ghulam Ishaq Khan Institute (GIKI)',
    shortName: 'GIKI Topi',
    city: 'Topi, KPK',
    popularDeliveryPoints: ['Hostel 6 Reception Desk', 'Hostel 10 Common Room', 'Helipad Market Area', 'Agha Hasan Abedi Central Library']
  },
  {
    id: 'comsats-isb',
    name: 'COMSATS University Islamabad',
    shortName: 'COMSATS Islamabad',
    city: 'Islamabad',
    popularDeliveryPoints: ['Park Road Main Gate 1', 'EE Faculty Block Lounge', 'Faculty of IT Cafe', 'Central Library Ground Floor']
  },
  {
    id: 'uet-lhr',
    name: 'University of Engineering & Technology (UET)',
    shortName: 'UET Lahore',
    city: 'Lahore',
    popularDeliveryPoints: ['GT Road Main Security Post', 'Zubair Hall Hostel', 'Mechanical Engineering Block', 'Staff Canteen Area']
  },
  {
    id: 'pu-lhr',
    name: 'University of the Punjab (PU)',
    shortName: 'Punjab University',
    city: 'Lahore',
    popularDeliveryPoints: ['New Campus Sheikh Zayed Gate', 'PU Hostel 15', 'College of IT (PUCIT) Old Campus', 'Undergraduate Study Center']
  },
  {
    id: 'ned-khi',
    name: 'NED University of Engineering & Technology',
    shortName: 'NED Karachi',
    city: 'Karachi',
    popularDeliveryPoints: ['Main University Road Gate', 'Student Convocation Area', 'Civil Engineering Dept Desk']
  },
  {
    id: 'aku-khi',
    name: 'Aga Khan University (AKU)',
    shortName: 'AKU Karachi',
    city: 'Karachi',
    popularDeliveryPoints: ['Stadium Road Main Entrance', 'Medical College Courtyard', 'School of Nursing Library']
  }
]
