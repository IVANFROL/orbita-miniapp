import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FillBar } from '../../components/FillBar'
import { PageEnter } from '../../components/PageEnter'
import { weekDates, weekday, todayISO } from '../../lib/dates'
import { useApp, useKids } from '../../store'

export function ParentStats() {
  const viewing = useApp((s) => s.session.viewingChildId)
  const viewChild = useApp((s) => s.viewChild)
  const kids = useKids()
  const instances = useApp((s) => s.instances)
  const tasks = useApp((s) => s.tasks)
  const stats = useApp((s) => s.stats)
  const goals = useApp((s) => s.goals)
  const week = weekDates()

  const st = stats.find((s) => s.childId === viewing)
  const bars = useMemo(() => {
    return week.map((d) => {
      const dayInst = instances.filter((i) => i.childId === viewing && i.date === d)
      const done = dayInst.filter((i) => i.status === 'done').length
      const total = dayInst.length || 1
      return { d, pct: done / total, done, total: dayInst.length }
    })
  }, [instances, viewing, week])

  const earnedWeek = instances
    .filter((i) => i.childId === viewing && i.status === 'done' && week.includes(i.date))
    .reduce((sum, i) => sum + (tasks.find((t) => t.id === i.taskId)?.cost ?? 0), 0)

  const doneCount = instances.filter((i) => i.childId === viewing && i.status === 'done').length
  const monthGoal = goals.find((g) => g.childId === viewing && g.period === 'month')
  const yearGoal = goals.find((g) => g.childId === viewing && g.period === 'year')

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">что уже пройдено</div>
          <h2 className="display">Путь</h2>
        </div>
      </div>
      <div className="kids-row" data-enter>
        {kids.map((k) => (
          <button key={k.id} className={`kid-chip ${viewing === k.id ? 'on' : ''}`} onClick={() => viewChild(k.id)}>
            <div className="avatar" style={{ background: k.color }}>
              {k.initial}
            </div>
            <b>{k.name}</b>
            <span>статистика</span>
          </button>
        ))}
      </div>

      <div className="stats-grid" data-enter>
        <div className="stat">
          <span className="muted">заработано всего</span>
          <b>{st?.lifetime}</b>
        </div>
        <div className="stat">
          <span className="muted">за эту неделю</span>
          <b>{earnedWeek}</b>
        </div>
        <div className="stat">
          <span className="muted">зачтено дел</span>
          <b>{doneCount}</b>
        </div>
        <div className="stat">
          <span className="muted">серия</span>
          <b>{st?.streak} дн.</b>
        </div>
      </div>

      <h3 data-enter>неделя</h3>
      <div className="pile" data-enter>
        <div className="chart">
          {bars.map((b) => (
            <i
              key={b.d}
              className={b.d === todayISO() ? '' : 'soft'}
              style={{ height: `${Math.max(10, b.pct * 100)}%` }}
              title={`${b.done}/${b.total}`}
            />
          ))}
        </div>
        <div className="week" style={{ margin: '8px 0 0' }}>
          {week.map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#8a7360' }}>
              {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'][weekday(d)]}
            </div>
          ))}
        </div>
      </div>

      <h3 data-enter>к цели</h3>
      <div className="goal-card" data-enter>
        <div className="eyebrow">месяц</div>
        <h2 className="display" style={{ fontSize: 22 }}>
          {monthGoal?.title}
        </h2>
        <div className="bar">
          <FillBar pct={Math.min(100, Math.round(((st?.balance ?? 0) / (monthGoal?.cost ?? 1)) * 100))} />
        </div>
        <div className="muted">
          {st?.balance} / {monthGoal?.cost}
        </div>
      </div>
      <div className="goal-card year" data-enter>
        <div className="eyebrow">год</div>
        <h2 className="display" style={{ fontSize: 22 }}>
          {yearGoal?.title}
        </h2>
        <div className="bar">
          <FillBar pct={Math.min(100, Math.round(((st?.balance ?? 0) / (yearGoal?.cost ?? 1)) * 100))} />
        </div>
        <div className="muted">
          {st?.balance} / {yearGoal?.cost}
        </div>
      </div>
      <Link to="/parent/goals" className="btn solid" data-enter>
        Править цели
      </Link>
    </PageEnter>
  )
}
