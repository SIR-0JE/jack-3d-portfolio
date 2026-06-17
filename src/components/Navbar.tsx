import React, { useState, useEffect } from 'react'
import FadeIn from './FadeIn'

const Navbar: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || '#/')
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const navLinks = [
    { label: 'Home', path: '#/' },
    { label: 'About', path: '#/about' },
    { label: 'Projects', path: '#/projects' },
  ]

  const handleLinkClick = (path: string) => {
    window.location.hash = path
  }

  return (
    <FadeIn delay={0} y={-20} as="header" className="fixed top-0 left-0 w-full z-50">
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 md:py-8 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5">
        {/* Logo / Jack */}
        <button
          onClick={() => handleLinkClick('#/')}
          className="text-lg md:text-xl lg:text-[1.5rem] font-black uppercase tracking-tight text-[#D7E2EA] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
        >
          Jack.3D
        </button>

        {/* Links */}
        <div className="flex gap-6 md:gap-10">
          {navLinks.map((link) => {
            const isActive = currentHash === link.path
            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.path)}
                className={`text-xs sm:text-sm md:text-base lg:text-[1.2rem] font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer bg-transparent border-none
                  ${isActive ? 'text-white border-b-2 border-purple-500 pb-1' : 'text-[#D7E2EA] hover:opacity-70 pb-1'}`}
              >
                {link.label}
              </button>
            )
          })}
        </div>
      </nav>
    </FadeIn>
  )
}

export default Navbar
