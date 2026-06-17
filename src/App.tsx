import { useState, useEffect } from 'react'
import { PortfolioProvider } from './context/PortfolioContext'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import ServicesSection from './sections/ServicesSection'
import Navbar from './components/Navbar'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import AdminPanel from './components/AdminPanel'

function MainContent() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash || '#/'
  })

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // If the admin route is active, show the Admin Panel directly
  if (currentRoute === '#/admin') {
    return <AdminPanel />
  }

  // Render client pages with the shared top Navbar
  return (
    <div
      style={{
        background: '#0C0C0C',
        fontFamily: "'Kanit', sans-serif",
        overflowX: 'clip',
      }}
      className="min-h-screen flex flex-col"
    >
      <Navbar />
      
      {/* Route Switcher */}
      <main className="flex-1">
        {currentRoute === '#/about' && <AboutPage />}
        {currentRoute === '#/projects' && <ProjectsPage />}
        {(currentRoute === '#/' || currentRoute === '') && (
          <>
            <HeroSection />
            <MarqueeSection />
            <ServicesSection />
          </>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  )
}

export default App
