import React, { useState } from 'react'
import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import { Mail, ArrowUpRight } from 'lucide-react'

const FooterCTA: React.FC = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <section
      id="contact-footer"
      className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-12 lg:px-16 py-32 sm:py-40 border-t border-neutral-900 relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]"
    >
      {/* Dynamic Radial Glow Background */}
      <div 
        className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full pointer-events-none transition-all duration-700 blur-[120px]"
        style={{
          background: hovered 
            ? 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, rgba(139,92,246,0) 70%)',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%'
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 sm:gap-14 text-center z-10">
        
        {/* Massive Headline */}
        <FadeIn delay={0} y={30}>
          <h2 
            className="hero-heading font-black uppercase leading-none tracking-tight font-sans max-w-3xl"
            style={{ fontSize: 'clamp(2.2rem, 7.5vw, 95px)' }}
          >
            Let's build something that matters.
          </h2>
        </FadeIn>

        {/* Magnetic Email CTA Button */}
        <FadeIn delay={0.2} y={30}>
          <Magnet strength={30}>
            <a
              href="mailto:niyi.designer@example.com"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group flex items-center gap-3 px-10 py-5 rounded-full bg-purple-600 border border-purple-500 text-white text-base sm:text-lg font-bold uppercase tracking-widest hover:bg-purple-700 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 cursor-pointer"
            >
              <Mail size={18} />
              <span>Get In Touch</span>
              <ArrowUpRight 
                size={18} 
                className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" 
              />
            </a>
          </Magnet>
        </FadeIn>
      </div>
    </section>
  )
}

export default FooterCTA
