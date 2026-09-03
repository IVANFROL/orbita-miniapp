import { NavLink } from 'react-router-dom'

const PARENT = [
  { to: '/parent', label: 'Семья', icon: '◎' },
  { to: '/parent/tasks', label: 'Дела', icon: '≡' },
  { to: '/parent/goals', label: 'Цели', icon: '☄' },
  { to: '/parent/shop', label: 'Магаз', icon: '✦' },
]

const CHILD = [
  { to: '/child', label: 'Сегодня', icon: '◎' },
  { to: '/child/goals', label: 'Цели', icon: '☄' },
  { to: '/child/shop', label: 'Магаз', icon: '✦' },
  { to: '/child/badges', label: 'Бейджи', icon: '★' },
]

export function BottomNav({ role }: { role: 'parent' | 'child' }) {
  const items = role === 'parent' ? PARENT : CHILD
  return (
    <nav className="nav">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === '/parent' || it.to === '/child'}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span>{it.icon}</span>
          {it.label}
        </NavLink>
      ))}
    </nav>
  )
}
