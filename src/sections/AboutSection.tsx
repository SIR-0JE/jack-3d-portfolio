import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import ContactButton from '../components/ContactButton'

const AboutSection: React.FC = () => {
  const { data } = usePortfolio()

  return (
    <section
      id="about-section"
      className="relative min-h-screen flex flex-col items-center justify-center
        px-5 sm:px-8 md:px-10 py-20 overflow-hidden"
      style={{ background: '#0C0C0C' }}
    >
      {/* Decorative 3D images - corners */}

      {/* Top-left: Moon */}
      {data.about.decorMoon && (
        <FadeIn
          delay={0.1}
          x={-80}
          y={0}
          duration={0.9}
          className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorMoon}
            alt="Moon decoration"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain"
          />
        </FadeIn>
      )}

      {/* Bottom-left: 3D object */}
      {data.about.decorP59 && (
        <FadeIn
          delay={0.25}
          x={-80}
          y={0}
          duration={0.9}
          className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorP59}
            alt="3D object decoration"
            className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain"
          />
        </FadeIn>
      )}

      {/* Top-right: Lego */}
      {data.about.decorLego && (
        <FadeIn
          delay={0.15}
          x={80}
          y={0}
          duration={0.9}
          className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorLego}
            alt="Lego icon decoration"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain"
          />
        </FadeIn>
      )}

      {/* Bottom-right: 3D group */}
      {data.about.decorGroup && (
        <FadeIn
          delay={0.3}
          x={80}
          y={0}
          duration={0.9}
          className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorGroup}
            alt="3D group decoration"
            className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain"
          />
        </FadeIn>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            {data.about.title}
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            key={data.about.description} // Key ensures text animates correctly when edited
            text={data.about.description}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <ContactButton />
        </div>
      </div>
    </section>
  )
}

export default AboutSection
