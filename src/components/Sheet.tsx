import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, type ReactNode } from 'react'

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.fromTo('.sheet-back', { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        '.sheet',
        { y: 40 },
        { y: 0, duration: 0.38, ease: 'power3.out' },
      )
    },
    { scope: ref },
  )
  return (
    <div ref={ref}>
      <div className="sheet-back" onClick={onClose} />
      <div className="sheet">
        <div className="grab" />
        <h2 className="display" style={{ fontSize: 22, marginBottom: 12 }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
