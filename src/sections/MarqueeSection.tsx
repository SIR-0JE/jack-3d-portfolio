import React, { useRef, useEffect, useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'

const MarqueeSection: React.FC = () => {
  const { data } = usePortfolio()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(200)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY
      const scrollOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(scrollOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data.marquee])

  const totalImages = data.marquee.length
  if (totalImages === 0) return null

  const half = Math.ceil(totalImages / 2)
  const list1 = data.marquee.slice(0, half)
  const list2 = data.marquee.slice(half)

  // triple for seamless scrolling
  const row1 = [...list1, ...list1, ...list1]
  const row2 = [...list2, ...list2, ...list2]

  return (
    <section
      id="marquee-section"
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      {/* Row 1 - moves right */}
      {row1.length > 0 && (
        <div
          className="flex gap-3 mb-3"
          style={{
            transform: `translateX(${offset - 200}px)`,
            willChange: 'transform',
          }}
        >
          {row1.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Portfolio preview row 1 ${i + 1}`}
              loading="lazy"
              className="rounded-2xl object-cover flex-shrink-0"
              style={{ width: '420px', height: '270px' }}
            />
          ))}
        </div>
      )}

      {/* Row 2 - moves left */}
      {row2.length > 0 && (
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${-(offset - 200)}px)`,
            willChange: 'transform',
          }}
        >
          {row2.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Portfolio preview row 2 ${i + 1}`}
              loading="lazy"
              className="rounded-2xl object-cover flex-shrink-0"
              style={{ width: '420px', height: '270px' }}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default MarqueeSection
