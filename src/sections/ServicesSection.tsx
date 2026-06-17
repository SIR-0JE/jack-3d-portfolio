import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import FadeIn from '../components/FadeIn'

const ServicesSection: React.FC = () => {
  const { data } = usePortfolio()

  return (
    <section
      id="price-section"
      className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {data.services.map((service, i) => (
          <FadeIn key={service.num + '-' + i} delay={i * 0.1} y={30}>
            <div
              className={`flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12
                ${i < data.services.length - 1 ? 'border-b' : ''}`}
              style={{
                borderColor: 'rgba(12, 12, 12, 0.15)',
              }}
            >
              {/* Number */}
              <span
                className="font-black text-[#0C0C0C] leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                aria-hidden="true"
              >
                {service.num}
              </span>

              {/* Name + Description */}
              <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-4">
                <span
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </span>
                <span
                  className="font-light leading-relaxed max-w-2xl text-[#0C0C0C]"
                  style={{
                    fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                    opacity: 0.6,
                  }}
                >
                  {service.desc}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
