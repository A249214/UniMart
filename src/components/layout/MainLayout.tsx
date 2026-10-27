import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileNav } from './MobileNav'

export const MainLayout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-forest-100 selection:text-forest-900">
      <AnnouncementBar />
      <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </div>
  )
}
