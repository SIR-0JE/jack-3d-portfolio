import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

interface AnimatedCharProps {
  scrollYProgress: MotionValue<number>
  start: number
  end: number
  char: string
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ scrollYProgress, start, end, char }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])
  return (
    <motion.span
      style={{ opacity, position: 'absolute', left: 0, top: 0 }}
      aria-hidden="true"
    >
      {char}
    </motion.span>
  )
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', style }) => {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const characters = text.split('')

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {characters.map((char, index) => {
        const start = index / characters.length
        const end = Math.min(start + 1 / characters.length + 0.05, 1)
        return (
          <span
            key={index}
            style={{
              position: 'relative',
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
            }}
          >
            <span style={{ opacity: 0 }}>{char}</span>
            <AnimatedChar
              scrollYProgress={scrollYProgress}
              start={start}
              end={end}
              char={char}
            />
          </span>
        )
      })}
    </p>
  )
}

export default AnimatedText
