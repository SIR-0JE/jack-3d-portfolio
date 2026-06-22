import React from 'react'
import FadeIn from '../components/FadeIn'

const steps = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Deep User Research, Interviews, Information Architecture, and Logic Maps that uncover the true scope of usability gaps.',
  },
  {
    num: '02',
    title: 'Iterate',
    desc: 'Rapid logic prototyping, wireframes, validation test loops, and system structure revisions before committing visual layers.',
  },
  {
    num: '03',
    title: 'Execute',
    desc: 'Unified typography tokens, responsive high-fidelity interfaces, component design systems, and detailed developer handoff files.',
  },
]

const ProcessSection: React.FC = () => {
  return (
    <section
      id="process-section"
      className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Section Heading */}
        <FadeIn delay={0} y={35} className="flex flex-col items-center text-center">
          <span className="text-purple-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
            Operational Blueprint
          </span>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mt-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
          >
            How I Think
          </h2>
        </FadeIn>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <FadeIn
              key={index}
              delay={index * 0.15}
              y={25}
              className="flex flex-col gap-5 p-6 sm:p-8 rounded-[30px] border border-neutral-900/60 bg-neutral-950/20 hover:border-neutral-800 transition-colors"
            >
              {/* Massive Number Outline */}
              <span
                className="font-black leading-none text-transparent select-none font-sans"
                style={{
                  fontSize: 'clamp(4rem, 10vw, 120px)',
                  WebkitTextStroke: '2px rgba(139, 92, 246, 0.3)',
                }}
              >
                {step.num}
              </span>

              {/* Step Title & Details */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-sans">
                  {step.title}
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light font-sans">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
