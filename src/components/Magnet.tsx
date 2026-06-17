import React, { useRef, useCallback } from 'react'

interface MagnetProps {
  children: React.ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isActive = useRef(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const absDistX = Math.abs(e.clientX - rect.left - rect.width / 2)
      const absDistY = Math.abs(e.clientY - rect.top - rect.height / 2)
      const halfW = rect.width / 2 + padding
      const halfH = rect.height / 2 + padding

      if (absDistX < halfW && absDistY < halfH) {
        if (!isActive.current) {
          isActive.current = true
          ref.current.style.transition = activeTransition
        }
        ref.current.style.transform = `translate3d(${distX / strength}px, ${distY / strength}px, 0)`
        ref.current.style.willChange = 'transform'
      } else {
        if (isActive.current) {
          isActive.current = false
          ref.current.style.transition = inactiveTransition
          ref.current.style.transform = 'translate3d(0, 0, 0)'
        }
      }
    },
    [padding, strength, activeTransition, inactiveTransition]
  )

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    isActive.current = false
    ref.current.style.transition = inactiveTransition
    ref.current.style.transform = 'translate3d(0, 0, 0)'
  }, [inactiveTransition])

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}

export default Magnet
