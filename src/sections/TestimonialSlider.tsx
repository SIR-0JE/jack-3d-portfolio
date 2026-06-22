import React from 'react'
import FadeIn from '../components/FadeIn'
import { MessageSquareQuote } from 'lucide-react'

const testimonials = [
  {
    quote: "Niyi restructured our civic platform's user workflows with outstanding results. User dropout decreased, navigation clarity improved, and the team registered positive feedback immediately.",
    name: "Sarah Jenkins",
    title: "Product Lead @ Electify"
  },
  {
    quote: "The design token schema and UI Handbooks Niyi prepared saved our development team dozens of hours. The attention to interactive micro-details is state of the art.",
    name: "Marcus Vance",
    title: "Lead Engineer @ Voterix"
  },
  {
    quote: "A true professional with a distinct, high-end visual signature. Niyi managed our logic prototypes and high-fidelity frameworks smoothly from start to finish.",
    name: "Elena Rostova",
    title: "CTO @ Solaris Tech"
  }
]

const TestimonialSlider: React.FC = () => {
  return (
    <section
      id="testimonials"
      className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32 border-t border-neutral-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Section Heading */}
        <FadeIn delay={0} y={35} className="flex flex-col items-center text-center">
          <span className="text-purple-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
            Kind Words
          </span>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mt-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
          >
            Social Proof
          </h2>
        </FadeIn>

        {/* Draggable/Scrollable Cards list */}
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="min-w-[280px] sm:min-w-[360px] md:min-w-[420px] bg-[#111] border border-purple-500/10 rounded-[30px] p-6 sm:p-8 flex flex-col gap-6 snap-start flex-1"
            >
              <div className="text-purple-400">
                <MessageSquareQuote size={32} />
              </div>
              
              <p className="text-[#D7E2EA] text-sm sm:text-base leading-relaxed font-light font-sans flex-1">
                "{t.quote}"
              </p>

              <div className="flex flex-col gap-1 border-t border-neutral-900 pt-4">
                <span className="text-sm font-bold text-white uppercase tracking-tight">
                  {t.name}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {t.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
