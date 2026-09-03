export const BADGES = [
  {
    id: 'first',
    name: 'Первый шаг',
    hint: 'Первая подтверждённая задача',
    mark: 'I',
  },
  {
    id: 'spark',
    name: 'Искра',
    hint: '5 дней подряд',
    mark: '5',
  },
  {
    id: 'comet',
    name: 'Комета',
    hint: '10 дней подряд',
    mark: '10',
  },
  {
    id: 'orbit',
    name: 'Орбита',
    hint: '21 день подряд',
    mark: '21',
  },
  {
    id: 'nova',
    name: 'Сверхновая',
    hint: '30 дней подряд',
    mark: '30',
  },
  {
    id: 'scholar',
    name: 'Отличник',
    hint: '10 домашек зачтено',
    mark: 'А',
  },
  {
    id: 'helper',
    name: 'Хранитель дома',
    hint: '10 обязанностей зачтено',
    mark: '⌂',
  },
] as const

export const LEVELS = [
  { level: 1, name: 'Искатель', from: 0 },
  { level: 2, name: 'Комета', from: 200 },
  { level: 3, name: 'Навигатор', from: 600 },
  { level: 4, name: 'Хранитель орбиты', from: 1200 },
] as const

export function levelFor(lifetime: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0]
  for (const l of LEVELS) {
    if (lifetime >= l.from) current = l
  }
  const next = LEVELS.find((l) => l.from > current.from)
  return { ...current, next }
}
