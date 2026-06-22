import { useState, useEffect, useRef } from 'react'
import { PortfolioProvider } from './context/PortfolioContext'
import HeroSection from './sections/HeroSection'
import ProjectsSection from './sections/ProjectsSection'
import ProcessSection from './sections/ProcessSection'
import VisualPlayground from './sections/VisualPlayground'
import TestimonialSlider from './sections/TestimonialSlider'
import FooterCTA from './sections/FooterCTA'
import Navbar from './components/Navbar'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import AdminPanel from './components/AdminPanel'
import ProjectDetailPage from './components/ProjectDetailPage'

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      
      setHovered(!!isInteractive)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-difference bg-white -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out hidden md:block
        ${hovered ? 'scale-[2.5]' : 'scale-100'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}

function MainContent() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash || '#/'
  })

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/')
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // If the admin route is active, show the Admin Panel directly
  if (currentRoute === '#/admin') {
    return <AdminPanel />
  }

  // Parse dynamic project case study routes: #/project/:num
  const isProjectDetail = currentRoute.startsWith('#/project/')
  const projectNum = isProjectDetail ? currentRoute.replace('#/project/', '') : ''

  // Render client pages with the shared top Navbar
  return (
    <div
      style={{
        background: '#0C0C0C',
        fontFamily: "'Kanit', sans-serif",
        overflowX: 'clip',
      }}
      className="min-h-screen flex flex-col select-none"
    >
      <CustomCursor />
      <Navbar />
      
      {/* Route Switcher */}
      <main className="flex-1">
        {currentRoute === '#/about' && <AboutPage />}
        {currentRoute === '#/projects' && <ProjectsPage />}
        {isProjectDetail && <ProjectDetailPage projectNum={projectNum} />}
        {(currentRoute === '#/' || currentRoute === '') && (
          <>
            <HeroSection />
            {/* Featured Outcomes Card Previews */}
            <ProjectsSection preview />
            {/* Interactive Process steps */}
            <ProcessSection />
            {/* Visual Grid Gallery (CSS Masonry) */}
            <VisualPlayground />
            {/* Draggable Client Review comments */}
            <TestimonialSlider />
            {/* Closing Footer with glowing Email CTA */}
            <FooterCTA />
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
