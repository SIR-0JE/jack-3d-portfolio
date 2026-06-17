import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import ContactButton from '../components/ContactButton'

const HeroSection: React.FC = () => {
  const { data } = usePortfolio()

  return (
    <section
      id="hero-section"
      className="h-screen flex flex-col pt-24 sm:pt-32"
      style={{ overflowX: 'clip', position: 'relative' }}
    >

      {/* Hero Heading */}
      <FadeIn delay={0.15} y={40} className="overflow-hidden w-full">
        <h1
          className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center
            text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]
            mt-6 sm:mt-4 md:-mt-5"
        >
          {data.hero.title}
        </h1>
      </FadeIn>

      {/* Bottom Bar */}
      <div className="flex-1 flex items-end justify-between px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug
              max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            {data.hero.subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Portrait - absolutely centered */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-1/2 -translate-x-1/2 z-10
          top-1/2 -translate-y-1/2
          sm:top-auto sm:translate-y-0 sm:bottom-0
          w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
      >
        <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
          <div className="relative group cursor-pointer w-full h-full">
            {/* Neutral Portrait */}
            <img
              src={data.hero.portrait}
              alt="Jack — 3D Creator portrait"
              className="w-full h-auto object-contain transition-opacity duration-300 group-hover:opacity-0"
              draggable={false}
            />
            {/* Smiling/Hover Portrait */}
            {data.hero.portraitHover && (
              <img
                src={data.hero.portraitHover}
                alt="Jack — 3D Creator portrait smiling"
                className="absolute inset-0 w-full h-auto object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                draggable={false}
              />
            )}
          </div>
        </Magnet>
      </FadeIn>
    </section>
  )
}

export default HeroSection
