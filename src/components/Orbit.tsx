import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useId, useRef } from 'react'

gsap.registerPlugin(MotionPathPlugin)

function ring(r: number, pct: number) {
  const c = 2 * Math.PI * r
  return { c, dash: Math.max(8, c * Math.min(1, Math.max(0, pct))) }
}

export function Orbit({
  monthPct,
  yearPct,
  value,
  caption,
}: {
  monthPct: number
  yearPct: number
  value: number
  caption: string
}) {
  const uid = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const month = ring(92, monthPct)
  const year = ring(116, yearPct)

  useGSAP(
    () => {
      gsap.fromTo(
        `#${uid}-year`,
        { strokeDasharray: `0 ${year.c}` },
        { strokeDasharray: `${year.dash} ${year.c}`, duration: 1.2, ease: 'power2.out' },
      )
      gsap.fromTo(
        `#${uid}-month`,
        { strokeDasharray: `0 ${month.c}` },
        { strokeDasharray: `${month.dash} ${month.c}`, duration: 1.1, delay: 0.12, ease: 'power2.out' },
      )
      gsap.to(`#${uid}-spin`, { rotation: 360, transformOrigin: '50% 50%', duration: 28, repeat: -1, ease: 'none' })
      gsap.to(`#${uid}-comet`, {
        duration: 10,
        repeat: -1,
        ease: 'none',
        motionPath: { path: `#${uid}-path`, autoRotate: true },
      })
    },
    { scope: ref, dependencies: [monthPct, yearPct] },
  )

  return (
    <div className="orbit-wrap" ref={ref}>
      <svg viewBox="0 0 280 280">
        <defs>
          <linearGradient id={`${uid}g`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#DD4B24" />
            <stop offset="1" stopColor="#E0A83A" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r="116" fill="none" stroke="rgba(35,23,15,.1)" strokeWidth="10" />
        <circle cx="140" cy="140" r="92" fill="none" stroke="rgba(26,90,76,.12)" strokeWidth="10" />
        <circle
          id={`${uid}-year`}
          cx="140"
          cy="140"
          r="116"
          fill="none"
          stroke={`url(#${uid}g)`}
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 140 140)"
        />
        <circle
          id={`${uid}-month`}
          cx="140"
          cy="140"
          r="92"
          fill="none"
          stroke="#1A5A4C"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 140 140)"
        />
        <g id={`${uid}-spin`}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <circle
                key={i}
                cx={140 + Math.cos(a) * 68}
                cy={140 + Math.sin(a) * 68}
                r={i % 3 === 0 ? 2.4 : 1.2}
                fill="#23170F"
                opacity={0.35}
              />
            )
          })}
        </g>
        <path
          id={`${uid}-path`}
          d="M140 24 A116 116 0 1 1 139.9 24"
          fill="none"
          stroke="none"
        />
        <g id={`${uid}-comet`}>
          <circle r="6" fill="#FBF4E8" />
          <circle r="3" fill="#DD4B24" />
        </g>
      </svg>
      <div className="orbit-center">
        <div>
          <em>счёт</em>
          <strong>{value}</strong>
          <small>{caption}</small>
        </div>
      </div>
    </div>
  )
}
