import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import { ArrowDown } from 'lucide-react'

const HeroSection: React.FC = () => {
  const { data } = usePortfolio()

  const handleScrollToProjects = () => {
    const section = document.getElementById('projects-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero-section"
      className="relative h-screen flex flex-col justify-between items-center text-[#D7E2EA] px-6 sm:px-10 py-12 select-none overflow-hidden"
    >
      {/* Background Portrait behind content / layered */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 z-0
          top-1/2 -translate-y-1/2
          w-[280px] sm:w-[360px] md:w-[440px] lg:w-[490px] opacity-70 hover:opacity-100 transition-opacity"
      >
        <Magnet padding={150} strength={3}>
          <div className="relative group cursor-pointer w-full h-full">
            {/* Neutral Portrait */}
            <img
              src={data.hero.portrait}
              alt="Niyi portrait"
              className="w-full h-auto object-contain transition-opacity duration-300 group-hover:opacity-0"
              draggable={false}
            />
            {/* Smiling/Hover Portrait */}
            {data.hero.portraitHover && (
              <img
                src={data.hero.portraitHover}
                alt="Niyi portrait smiling"
                className="absolute inset-0 w-full h-auto object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                draggable={false}
              />
            )}
          </div>
        </Magnet>
      </div>

      {/* Empty space for top header spacer */}
      <div />

      {/* Centered H1 hooks */}
      <div className="w-full max-w-5xl text-center flex flex-col items-center gap-6 z-10">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase leading-[1.05] tracking-tighter"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 95px)' }}
          >
            {data.hero.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} y={20}>
          <span 
            className="text-purple-400 font-bold uppercase tracking-widest bg-purple-950/20 border border-purple-500/10 px-4 py-2 rounded-full font-mono text-xs sm:text-sm"
          >
            {data.hero.subtitle}
          </span>
        </FadeIn>
      </div>

      {/* Bottom CTA indicator */}
      <div className="z-10 flex flex-col items-center">
        <FadeIn delay={0.5} y={20}>
          <Magnet strength={20}>
            <button
              onClick={handleScrollToProjects}
              className="group flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              <span>Explore My Work</span>
              <span className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                <ArrowDown size={14} className="animate-bounce" />
              </span>
            </button>
          </Magnet>
        </FadeIn>
      </div>
    </section>
  )
}

export default HeroSection
