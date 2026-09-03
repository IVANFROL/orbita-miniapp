import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

export function CometArt() {
  const ref = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      gsap.fromTo(
        '#tail',
        { strokeDasharray: 280, strokeDashoffset: 280 },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
      )
      gsap.fromTo('#head', { scale: 0, transformOrigin: '38px 26px' }, { scale: 1, duration: 0.5, delay: 0.7, ease: 'back.out(2)' })
      gsap.to('#orbit-ring', { rotation: 360, transformOrigin: '38px 26px', duration: 18, repeat: -1, ease: 'none' })
      gsap.to('#spark-a', { y: -8, x: 4, opacity: 0.2, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to('#spark-b', { y: 6, x: -6, opacity: 0.15, duration: 1.9, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.3 })
    },
    { scope: ref },
  )

  return (
    <svg className="comet-art" viewBox="0 0 360 220" ref={ref}>
      <circle id="spark-a" cx="70" cy="50" r="3" fill="#23170F" />
      <circle id="spark-b" cx="300" cy="40" r="2" fill="#23170F" />
      <circle cx="240" cy="160" r="2.5" fill="#DD4B24" opacity="0.7" />
      <circle cx="40" cy="170" r="1.5" fill="#1A5A4C" />
      <path
        id="tail"
        d="M20 180 C80 120, 150 70, 230 62"
        fill="none"
        stroke="#DD4B24"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M36 168 C90 118, 150 78, 210 70"
        fill="none"
        stroke="#E0A83A"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
      <g id="orbit-ring">
        <ellipse cx="262" cy="70" rx="58" ry="22" fill="none" stroke="#23170F" strokeWidth="1.5" opacity="0.35" transform="rotate(-18 262 70)" />
      </g>
      <g id="head">
        <circle cx="248" cy="66" r="28" fill="#E0A83A" />
        <circle cx="248" cy="66" r="16" fill="#FBF4E8" />
        <circle cx="242" cy="62" r="5" fill="#23170F" />
      </g>
      <text x="20" y="214" fill="#8A7360" fontFamily="Manrope" fontSize="12" fontWeight="700">
        привычки летят к цели
      </text>
    </svg>
  )
}
