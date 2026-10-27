import React from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { StudentBundlesSection } from '@/components/home/StudentBundlesSection'
import { CampusPerks } from '@/components/home/CampusPerks'
import { StudentReviews } from '@/components/home/StudentReviews'
import { NewsletterSection } from '@/components/home/NewsletterSection'

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <StudentBundlesSection />
      <CampusPerks />
      <StudentReviews />
      <NewsletterSection />
    </div>
  )
}
