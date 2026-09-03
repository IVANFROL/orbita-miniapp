import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useApp } from '../store'

export function Toasts() {
  const toasts = useApp((s) => s.toasts)
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const nodes = ref.current?.children
      if (!nodes?.length) return
      gsap.fromTo(
        nodes[nodes.length - 1],
        { y: -16, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' },
      )
    },
    { dependencies: [toasts.length], scope: ref },
  )
  return (
    <div className="toasts" ref={ref}>
      {toasts.map((t) => (
        <div className={`toast ${t.tone}`} key={t.id}>
          {t.text}
        </div>
      ))}
    </div>
  )
}
