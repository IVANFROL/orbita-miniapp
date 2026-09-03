import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, type ReactNode } from 'react'

export function PageEnter({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.48, ease: 'power3.out' },
      )
      const bits = ref.current?.querySelectorAll('[data-enter]')
      if (bits?.length) {
        gsap.fromTo(
          bits,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.055, duration: 0.4, delay: 0.08, ease: 'power2.out' },
        )
      }
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={`scroll ${className}`}>
      {children}
    </div>
  )
}
