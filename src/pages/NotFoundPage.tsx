import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, Home, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/common/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 bg-background py-16 sm:py-24 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg text-center">
        
        <div className="w-16 h-16 rounded bg-forest-900 text-ivory-50 flex items-center justify-center mx-auto mb-6 shadow-card">
          <GraduationCap className="w-8 h-8 text-sand-200" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-clay-700 bg-clay-50 px-3 py-1 rounded border border-clay-200">
          Error 404
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-3 mb-2">
          Page Off Campus Bounds
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-8 font-sans">
          The study portal, syllabus category, or product page you are attempting to access does not exist or has been relocated to another academic wing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4 mr-2" />}>
              Back to Campus Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ShoppingBag className="w-4 h-4 mr-2 text-forest-800" />}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Browse Catalog
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-sand-300 text-xs text-muted-foreground">
          UniMart Pakistan — Everything for your campus life.
        </div>

      </div>
    </div>
  )
}
