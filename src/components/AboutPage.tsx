import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import FadeIn from './FadeIn'
import AnimatedText from './AnimatedText'
import ContactButton from './ContactButton'

const AboutPage: React.FC = () => {
  const { data } = usePortfolio()

  return (
    <div
      className="min-h-screen relative flex flex-col items-center pt-32 pb-24 px-5 sm:px-8 md:px-10 overflow-hidden"
      style={{ background: '#0C0C0C' }}
    >
      {/* Decorative 3D images - absolute corners */}
      {data.about.decorMoon && (
        <FadeIn
          delay={0.1}
          x={-80}
          y={0}
          duration={0.9}
          className="absolute top-[8%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorMoon}
            alt="Moon decoration"
            className="w-[100px] sm:w-[130px] md:w-[170px] h-auto object-contain opacity-40 sm:opacity-100"
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
          className="absolute bottom-[20%] left-[3%] sm:left-[6%] md:left-[8%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorP59}
            alt="3D object decoration"
            className="w-[90px] sm:w-[110px] md:w-[140px] h-auto object-contain opacity-40 sm:opacity-100"
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
          className="absolute top-[8%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorLego}
            alt="Lego icon decoration"
            className="w-[100px] sm:w-[130px] md:w-[170px] h-auto object-contain opacity-40 sm:opacity-100"
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
          className="absolute bottom-[20%] right-[3%] sm:right-[6%] md:right-[8%] pointer-events-none z-0"
        >
          <img
            src={data.about.decorGroup}
            alt="3D group decoration"
            className="w-[110px] sm:w-[130px] md:w-[170px] h-auto object-contain opacity-40 sm:opacity-100"
          />
        </FadeIn>
      )}

      {/* Content Container */}
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center gap-16 sm:gap-24 md:gap-28">
        
        {/* Header Title */}
        <FadeIn delay={0} y={40}>
          <h1
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 110px)' }}
          >
            {data.about.title}
          </h1>
        </FadeIn>

        {/* Bio scroll-reveal description */}
        <AnimatedText
          key={data.about.description}
          text={data.about.description}
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[620px]"
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}
        />

        {/* Skills Grid Section */}
        <div className="w-full flex flex-col items-center gap-6">
          <FadeIn delay={0.1} y={20}>
            <h2 className="text-[#D7E2EA] font-bold uppercase tracking-widest text-sm sm:text-base border-b border-white/10 pb-2">
              Capabilities & Tools
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} y={30} className="w-full">
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
              {data.about.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-300 font-medium uppercase tracking-wider text-xs sm:text-sm hover:border-purple-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Experience Timeline Section */}
        <div className="w-full flex flex-col items-center gap-8">
          <FadeIn delay={0.1} y={20}>
            <h2 className="text-[#D7E2EA] font-bold uppercase tracking-widest text-sm sm:text-base border-b border-white/10 pb-2">
              Professional Journey
            </h2>
          </FadeIn>

          <div className="w-full max-w-2xl relative border-l border-neutral-800 ml-4 pl-6 sm:pl-8 flex flex-col gap-10">
            {data.about.timeline.map((item, index) => (
              <FadeIn key={index} delay={index * 0.15} y={30} className="relative">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0C0C0C] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

                <div className="flex flex-col gap-1.5 bg-neutral-900/20 border border-neutral-800/40 p-5 rounded-2xl hover:border-neutral-800 transition-colors">
                  <span className="text-xs font-bold text-purple-400 font-mono tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                    {item.role} <span className="text-neutral-500 font-medium lowercase">at</span> {item.company}
                  </h3>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Call To Action button */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </div>
  )
}

export default AboutPage
