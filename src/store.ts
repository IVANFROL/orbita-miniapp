import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BADGES } from './lib/badges'
import { addDays, todayISO, uid, weekDates, weekday } from './lib/dates'
import {
  FAMILY,
  GOALS,
  PEOPLE,
  PURCHASES,
  REWARDS,
  STATS,
  TASKS,
  makeWeekInstances,
} from './lib/seed'
import { haptic } from './lib/telegram'
import type {
  ChildStats,
  Goal,
  GoalPeriod,
  Person,
  Purchase,
  Reward,
  Role,
  Task,
  TaskCategory,
  TaskInstance,
  Toast,
} from './types'

export interface AppState {
  people: Person[]
  tasks: Task[]
  instances: TaskInstance[]
  goals: Goal[]
  rewards: Reward[]
  purchases: Purchase[]
  stats: ChildStats[]
  session: { role: Role | null; personId: string | null; viewingChildId: string }
  toasts: Toast[]
  inviteChild: string
  inviteParent: string
  login: (role: Role, personId: string) => void
  logout: () => void
  viewChild: (id: string) => void
  ensureWeek: () => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  removeTask: (id: string) => void
  childDone: (instanceId: string) => void
  parentCheck: (instanceId: string, ok: boolean) => void
  saveGoal: (goal: Omit<Goal, 'id'> & { id?: string }) => void
  addReward: (reward: Omit<Reward, 'id'>) => void
  updateReward: (id: string, patch: Partial<Reward>) => void
  removeReward: (id: string) => void
  buy: (childId: string, rewardId: string) => void
  settlePurchase: (id: string, ok: boolean) => void
  toast: (text: string, tone?: Toast['tone']) => void
  clearToast: (id: string) => void
  resetDemo: () => void
}

function fresh() {
  return {
    people: PEOPLE,
    tasks: TASKS,
    instances: makeWeekInstances(TASKS),
    goals: GOALS,
    rewards: REWARDS,
    purchases: PURCHASES,
    stats: STATS,
    session: { role: null as Role | null, personId: null as string | null, viewingChildId: 'artem' },
    toasts: [] as Toast[],
    inviteChild: FAMILY.inviteChild,
    inviteParent: FAMILY.inviteParent,
  }
}

function bumpBadges(stats: ChildStats, homeworkDone: number, choreDone: number): string[] {
  const next = new Set(stats.badges)
  if (stats.lifetime > 0 || homeworkDone + choreDone > 0) next.add('first')
  if (stats.streak >= 5) next.add('spark')
  if (stats.streak >= 10) next.add('comet')
  if (stats.streak >= 21) next.add('orbit')
  if (stats.streak >= 30) next.add('nova')
  if (homeworkDone >= 10) next.add('scholar')
  if (choreDone >= 10) next.add('helper')
  return [...next]
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...fresh(),

      login: (role, personId) => {
        const viewing = role === 'child' ? personId : get().session.viewingChildId
        set({ session: { role, personId, viewingChildId: viewing } })
        get().ensureWeek()
        haptic('light')
      },

      logout: () => set({ session: { role: null, personId: null, viewingChildId: get().session.viewingChildId } }),

      viewChild: (id) => set({ session: { ...get().session, viewingChildId: id } }),

      ensureWeek: () => {
        const { tasks, instances } = get()
        const days = weekDates()
        const extra: TaskInstance[] = []
        for (const task of tasks) {
          for (const date of days) {
            if (!task.days.includes(weekday(date))) continue
            const exists = instances.some((i) => i.taskId === task.id && i.date === date)
            if (!exists) {
              extra.push({
                id: uid(),
                taskId: task.id,
                childId: task.childId,
                date,
                status: date < todayISO() ? 'todo' : 'todo',
              })
            }
          }
        }
        if (extra.length) set({ instances: [...get().instances, ...extra] })
      },

      addTask: (task) => {
        const id = uid()
        const next = { ...task, id }
        set({ tasks: [...get().tasks, next] })
        get().ensureWeek()
        get().toast('Задача на орбите', 'ok')
      },

      updateTask: (id, patch) => {
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })
        get().ensureWeek()
      },

      removeTask: (id) => {
        set({
          tasks: get().tasks.filter((t) => t.id !== id),
          instances: get().instances.filter((i) => i.taskId !== id),
        })
        get().toast('Задача снята', 'wait')
      },

      childDone: (instanceId) => {
        set({
          instances: get().instances.map((i) =>
            i.id === instanceId ? { ...i, status: 'awaiting' } : i,
          ),
        })
        haptic('medium')
        get().toast('Отправлено родителям на чек', 'wait')
      },

      parentCheck: (instanceId, ok) => {
        const inst = get().instances.find((i) => i.id === instanceId)
        const task = inst ? get().tasks.find((t) => t.id === inst.taskId) : undefined
        if (!inst || !task) return

        set({
          instances: get().instances.map((i) =>
            i.id === instanceId ? { ...i, status: ok ? 'done' : 'rejected' } : i,
          ),
        })

        if (!ok) {
          haptic('error')
          get().toast('Вернули на доработку', 'no')
          return
        }

        const today = todayISO()
        const stats = get().stats.map((s) => {
          if (s.childId !== inst.childId) return s
          const yesterday = addDays(today, -1)
          let streak = s.streak
          if (s.lastActive === today) streak = s.streak
          else if (s.lastActive === yesterday) streak = s.streak + 1
          else streak = 1

          const homeworkDone = get().instances.filter((i) => {
            const t = get().tasks.find((x) => x.id === i.taskId)
            return i.childId === s.childId && i.status === 'done' && t?.category === 'homework'
          }).length
          const choreDone = get().instances.filter((i) => {
            const t = get().tasks.find((x) => x.id === i.taskId)
            return i.childId === s.childId && i.status === 'done' && t?.category === 'chore'
          }).length

          const next: ChildStats = {
            ...s,
            balance: s.balance + task.cost,
            lifetime: s.lifetime + task.cost,
            streak,
            lastActive: today,
            badges: s.badges,
          }
          next.badges = bumpBadges(next, homeworkDone, choreDone)
          const unlocked = next.badges.filter((b) => !s.badges.includes(b))
          if (unlocked.length) {
            const name = BADGES.find((b) => b.id === unlocked[0])?.name
            get().toast(`Новый бейдж: ${name}`, 'ok')
          }
          return next
        })

        set({ stats })
        haptic('success')
        get().toast(`+${task.cost} на счёт`, 'ok')
      },

      saveGoal: (goal) => {
        if (goal.id) {
          set({
            goals: get().goals.map((g) => (g.id === goal.id ? { ...g, ...goal, id: g.id } : g)),
          })
          get().toast('Цель обновлена', 'ok')
          return
        }
        set({ goals: [...get().goals, { ...goal, id: uid() }] })
        get().toast('Цель поставлена', 'ok')
      },

      addReward: (reward) => {
        set({ rewards: [...get().rewards, { ...reward, id: uid() }] })
        get().toast('Награда в магазине', 'ok')
      },

      updateReward: (id, patch) => {
        set({ rewards: get().rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)) })
      },

      removeReward: (id) => {
        set({ rewards: get().rewards.filter((r) => r.id !== id) })
      },

      buy: (childId, rewardId) => {
        const reward = get().rewards.find((r) => r.id === rewardId)
        const stats = get().stats.find((s) => s.childId === childId)
        if (!reward || !stats) return
        if (stats.balance < reward.cost) {
          get().toast('Пока не хватает бонусов', 'no')
          haptic('error')
          return
        }
        set({
          stats: get().stats.map((s) =>
            s.childId === childId ? { ...s, balance: s.balance - reward.cost } : s,
          ),
          purchases: [
            {
              id: uid(),
              childId,
              rewardId,
              status: 'pending',
              at: todayISO(),
            },
            ...get().purchases,
          ],
        })
        haptic('medium')
        get().toast('Запрос отправлен маме и папе', 'wait')
      },

      settlePurchase: (id, ok) => {
        const p = get().purchases.find((x) => x.id === id)
        const reward = p ? get().rewards.find((r) => r.id === p.rewardId) : undefined
        if (!p || !reward) return
        set({
          purchases: get().purchases.map((x) =>
            x.id === id ? { ...x, status: ok ? 'approved' : 'rejected' } : x,
          ),
        })
        if (!ok) {
          set({
            stats: get().stats.map((s) =>
              s.childId === p.childId ? { ...s, balance: s.balance + reward.cost } : s,
            ),
          })
          get().toast('Бонусы вернулись на счёт', 'wait')
          return
        }
        haptic('success')
        get().toast('Награда выдана', 'ok')
      },

      toast: (text, tone = 'ok') => {
        const id = uid()
        set({ toasts: [...get().toasts, { id, text, tone }] })
        window.setTimeout(() => get().clearToast(id), 2800)
      },

      clearToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      resetDemo: () => {
        const keep = get().session
        set({ ...fresh(), session: keep, toasts: [] })
        get().toast('Демо сброшено', 'wait')
      },
    }),
    {
      name: 'orbita-family-v1',
      partialize: (s) => ({
        people: s.people,
        tasks: s.tasks,
        instances: s.instances,
        goals: s.goals,
        rewards: s.rewards,
        purchases: s.purchases,
        stats: s.stats,
        session: s.session,
        inviteChild: s.inviteChild,
        inviteParent: s.inviteParent,
      }),
    },
  ),
)

export function usePerson(id?: string | null) {
  return useApp((s) => s.people.find((p) => p.id === id))
}

export function useChildStats(id: string) {
  return useApp((s) => s.stats.find((x) => x.childId === id))
}

export function useKids() {
  return useApp((s) => s.people.filter((p) => p.role === 'child'))
}

export function useParents() {
  return useApp((s) => s.people.filter((p) => p.role === 'parent'))
}

export function categoryLabel(c: TaskCategory) {
  return c === 'homework' ? 'домашка' : 'дом'
}

export function periodLabel(p: GoalPeriod) {
  return p === 'month' ? 'месяц' : 'год'
}
