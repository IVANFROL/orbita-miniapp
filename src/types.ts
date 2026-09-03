export type Role = 'parent' | 'child'
export type TaskCategory = 'homework' | 'chore'
export type InstanceStatus = 'todo' | 'awaiting' | 'done' | 'rejected'
export type GoalPeriod = 'month' | 'year'
export type PurchaseStatus = 'pending' | 'approved' | 'rejected'

export interface Person {
  id: string
  name: string
  role: Role
  age?: number
  relation?: string
  color: string
  initial: string
}

export interface Task {
  id: string
  childId: string
  title: string
  category: TaskCategory
  cost: number
  days: number[]
}

export interface TaskInstance {
  id: string
  taskId: string
  childId: string
  date: string
  status: InstanceStatus
}

export interface Goal {
  id: string
  childId: string
  title: string
  period: GoalPeriod
  cost: number
  rewardTitle?: string
}

export interface Reward {
  id: string
  title: string
  hint: string
  cost: number
  icon: string
}

export interface Purchase {
  id: string
  childId: string
  rewardId: string
  status: PurchaseStatus
  at: string
}

export interface ChildStats {
  childId: string
  balance: number
  lifetime: number
  streak: number
  lastActive?: string
  badges: string[]
}

export interface Toast {
  id: string
  text: string
  tone: 'ok' | 'wait' | 'no'
}

export interface Session {
  role: Role | null
  personId: string | null
  viewingChildId: string | null
}
