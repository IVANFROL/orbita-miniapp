export function RewardIcon({ name }: { name: string }) {
  const common = { width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none' }
  switch (name) {
    case 'ice':
      return (
        <svg {...common}>
          <path d="M14 4 L18 12 H10 Z" fill="#E0A83A" />
          <rect x="11" y="12" width="6" height="12" rx="3" fill="#DD4B24" />
        </svg>
      )
    case 'time':
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="9" stroke="#1A5A4C" strokeWidth="2" />
          <path d="M14 8 V14 L18 16" stroke="#23170F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'film':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="18" height="12" rx="2" fill="#2C3D55" />
          <circle cx="10" cy="14" r="2" fill="#FBF4E8" />
          <circle cx="18" cy="14" r="2" fill="#FBF4E8" />
        </svg>
      )
    case 'pizza':
      return (
        <svg {...common}>
          <path d="M6 20 L14 5 L22 20 Z" fill="#E0A83A" />
          <circle cx="13" cy="14" r="1.4" fill="#DD4B24" />
          <circle cx="16" cy="16" r="1.2" fill="#1A5A4C" />
        </svg>
      )
    case 'cash':
      return (
        <svg {...common}>
          <rect x="4" y="8" width="20" height="12" rx="2" fill="#1A5A4C" />
          <circle cx="14" cy="14" r="3" fill="#E0A83A" />
        </svg>
      )
    case 'ticket':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="18" height="12" rx="3" fill="#DD4B24" />
          <path d="M9 8 V20 M19 8 V20" stroke="#FBF4E8" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="M5 14 L14 6 L23 14 V22 H5 Z" fill="#2C3D55" />
          <rect x="12" y="15" width="4" height="7" fill="#E0A83A" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="8" fill="#E0A83A" />
          <circle cx="14" cy="14" r="3" fill="#23170F" />
        </svg>
      )
  }
}
