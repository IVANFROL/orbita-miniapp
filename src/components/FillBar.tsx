import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

export function FillBar({ pct }: { pct: number }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { width: '0%' },
        { width: `${Math.min(100, Math.max(0, pct))}%`, duration: 1.05, ease: 'power3.out' },
      )
    },
    { dependencies: [pct] },
  )
  return <i ref={ref} />
}
