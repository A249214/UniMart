import React from 'react'
import { MapPin, Sparkles } from 'lucide-react'
import { useCampus } from '@/context/CampusContext'
import { Link } from 'react-router-dom'

export const AnnouncementBar: React.FC = () => {
  const { currentCampus } = useCampus()

  return (
    <div className="bg-forest-950 text-sand-100 text-xs py-1.5 px-4 border-b border-forest-900/40">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-clay-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-clay-400" />
            Midterm Prep Week:
          </span>
          <span className="hidden md:inline text-sand-300">
            Free hostel desk delivery on student orders over Rs. 2,500.
          </span>
          <span className="md:hidden text-sand-300">
            Free campus delivery on Rs. 2,500+
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-sand-300">
          <div className="flex items-center gap-1 text-sand-200">
            <MapPin className="w-3 h-3 text-clay-400" />
            <span>Delivering to: <strong className="text-white font-semibold">{currentCampus.shortName}</strong></span>
          </div>
          <span className="text-forest-700 hidden sm:inline">|</span>
          <Link to="/orders" className="hover:text-white transition-colors underline-offset-2 hover:underline hidden sm:inline">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
