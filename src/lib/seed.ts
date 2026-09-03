import type {
  ChildStats,
  Goal,
  Person,
  Purchase,
  Reward,
  Task,
  TaskInstance,
} from '../types'
import { addDays, todayISO, uid, weekDates, weekday } from './dates'

export const FAMILY = {
  inviteChild: 'ОРБ-4821',
  inviteParent: 'РОД-1190',
}

export const PEOPLE: Person[] = [
  {
    id: 'maria',
    name: 'Мария',
    role: 'parent',
    relation: 'мама',
    color: '#DD4B24',
    initial: 'М',
  },
  {
    id: 'dmitry',
    name: 'Дмитрий',
    role: 'parent',
    relation: 'папа',
    color: '#1A5A4C',
    initial: 'Д',
  },
  {
    id: 'artem',
    name: 'Артём',
    role: 'child',
    age: 9,
    relation: 'сын',
    color: '#E0A83A',
    initial: 'А',
  },
  {
    id: 'sonya',
    name: 'Соня',
    role: 'child',
    age: 12,
    relation: 'дочь',
    color: '#3D6B8A',
    initial: 'С',
  },
]

export const TASKS: Task[] = [
  { id: 't1', childId: 'artem', title: 'Математика, упр. 4', category: 'homework', cost: 40, days: [0, 1, 2, 3, 4] },
  { id: 't2', childId: 'artem', title: 'Заправить кровать', category: 'chore', cost: 15, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 't3', childId: 'artem', title: 'Вынести мусор', category: 'chore', cost: 20, days: [0, 2, 4] },
  { id: 't4', childId: 'artem', title: 'Погулять с Барсиком', category: 'chore', cost: 25, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 't5', childId: 'artem', title: 'Прочитать 10 страниц', category: 'homework', cost: 30, days: [0, 1, 2, 3, 4, 6] },
  { id: 't6', childId: 'sonya', title: 'Английский: unit 5', category: 'homework', cost: 45, days: [0, 2, 4] },
  { id: 't7', childId: 'sonya', title: 'Алгебра', category: 'homework', cost: 50, days: [0, 1, 2, 3, 4] },
  { id: 't8', childId: 'sonya', title: 'Помыть посуду', category: 'chore', cost: 20, days: [0, 1, 2, 3, 4, 5] },
  { id: 't9', childId: 'sonya', title: 'Комната в порядке', category: 'chore', cost: 25, days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 't10', childId: 'sonya', title: 'Фортепиано 20 минут', category: 'homework', cost: 35, days: [1, 3, 5] },
]

export const GOALS: Goal[] = [
  { id: 'g1', childId: 'artem', title: 'Парк аттракционов', period: 'month', cost: 800, rewardTitle: 'Семейный день в парке' },
  { id: 'g2', childId: 'artem', title: 'Новый велосипед', period: 'year', cost: 2500, rewardTitle: 'Велосипед Stels' },
  { id: 'g3', childId: 'sonya', title: 'Беспроводные наушники', period: 'month', cost: 1200, rewardTitle: 'Наушники' },
  { id: 'g4', childId: 'sonya', title: 'Поездка в Казань', period: 'year', cost: 4000, rewardTitle: 'Выходные в Казани' },
]

export const REWARDS: Reward[] = [
  { id: 'r1', title: 'Мороженое', hint: 'Любой вкус в магазине у дома', cost: 40, icon: 'ice' },
  { id: 'r2', title: '+30 мин планшета', hint: 'Сегодня вечером', cost: 60, icon: 'time' },
  { id: 'r3', title: 'Выбрать мультфильм', hint: 'Семейный вечер', cost: 35, icon: 'film' },
  { id: 'r4', title: 'Пицца в пятницу', hint: 'Заказ любимой', cost: 120, icon: 'pizza' },
  { id: 'r5', title: '100 ₽ на карман', hint: 'Наличные или перевод', cost: 150, icon: 'cash' },
  { id: 'r6', title: 'Кино с родителями', hint: 'Сеанс на выходных', cost: 180, icon: 'ticket' },
  { id: 'r7', title: 'Ночёвка у друга', hint: 'По договорённости', cost: 250, icon: 'home' },
  { id: 'r8', title: 'Боулинг', hint: 'Один час игры', cost: 300, icon: 'bowl' },
]

export const STATS: ChildStats[] = [
  { childId: 'artem', balance: 340, lifetime: 340, streak: 5, lastActive: addDays(todayISO(), -1), badges: ['first', 'spark'] },
  { childId: 'sonya', balance: 610, lifetime: 980, streak: 12, lastActive: addDays(todayISO(), -1), badges: ['first', 'spark', 'comet', 'scholar'] },
]

export function makeWeekInstances(tasks: Task[]): TaskInstance[] {
  const today = todayISO()
  const days = weekDates(today)
  const list: TaskInstance[] = []

  for (const task of tasks) {
    for (const date of days) {
      if (!task.days.includes(weekday(date))) continue
      const status = seedStatus(task, date, today)
      list.push({
        id: uid(),
        taskId: task.id,
        childId: task.childId,
        date,
        status,
      })
    }
  }
  return list
}

function seedStatus(task: Task, date: string, today: string): TaskInstance['status'] {
  if (date > today) return 'todo'
  if (date < today) {
    if (task.id === 't3' && date === addDays(today, -1)) return 'todo'
    return 'done'
  }
  if (task.id === 't3') return 'awaiting'
  if (task.id === 't8') return 'awaiting'
  if (task.id === 't2' || task.id === 't9') return 'done'
  return 'todo'
}

export const PURCHASES: Purchase[] = [
  {
    id: 'p1',
    childId: 'sonya',
    rewardId: 'r1',
    status: 'pending',
    at: todayISO(),
  },
]
