export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO() {
  return toISO(new Date())
}

export function parseISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, n: number) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function weekday(iso: string) {
  const day = parseISO(iso).getDay()
  return day === 0 ? 6 : day - 1
}

export function weekDates(from = todayISO()) {
  const current = weekday(from)
  const monday = addDays(from, -current)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function monthLabel(iso = todayISO()) {
  return parseISO(iso).toLocaleDateString('ru-RU', { month: 'long' })
}

export function dayShort(iso: string) {
  return parseISO(iso).toLocaleDateString('ru-RU', { weekday: 'short' })
}

export function dayNum(iso: string) {
  return parseISO(iso).getDate()
}

export function prettyDate(iso: string) {
  return parseISO(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  })
}

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function nowStamp() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
