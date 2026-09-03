import { useMemo, useState } from 'react'
import { PageEnter } from '../../components/PageEnter'
import { Orbit } from '../../components/Orbit'
import { TaskTicket } from '../../components/TaskTicket'
import { dayNum, dayShort, todayISO, weekDates } from '../../lib/dates'
import { useApp } from '../../store'

export function ChildHome() {
  const personId = useApp((s) => s.session.personId) ?? 'artem'
  const me = useApp((s) => s.people.find((p) => p.id === personId))
  const stats = useApp((s) => s.stats.find((s) => s.childId === personId))
  const tasks = useApp((s) => s.tasks)
  const instances = useApp((s) => s.instances)
  const goals = useApp((s) => s.goals)
  const childDone = useApp((s) => s.childDone)
  const week = weekDates()
  const [day, setDay] = useState(todayISO())
  const [mode, setMode] = useState<'day' | 'week'>('day')

  const month = goals.find((g) => g.childId === personId && g.period === 'month')
  const year = goals.find((g) => g.childId === personId && g.period === 'year')
  const monthPct = month && stats ? stats.balance / month.cost : 0
  const yearPct = year && stats ? stats.balance / year.cost : 0

  const dayList = useMemo(() => {
    const show = mode === 'day' ? [day] : week
    return show.flatMap((d) =>
      instances
        .filter((i) => i.childId === personId && i.date === d)
        .map((i) => ({ inst: i, task: tasks.find((t) => t.id === i.taskId), date: d })),
    )
  }, [instances, tasks, personId, day, mode, week])

  const visible = mode === 'day' ? dayList.filter((x) => x.date === day) : dayList

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">привет, капитан</div>
          <h2 className="display">{me?.name}</h2>
        </div>
        <div className="coin">★ {stats?.balance}</div>
      </div>

      <Orbit
        monthPct={monthPct}
        yearPct={yearPct}
        value={stats?.balance ?? 0}
        caption={month ? `до «${month.title}»` : 'бонусы'}
      />

      <div className="seg" data-enter>
        <button className={mode === 'day' ? 'on' : ''} onClick={() => setMode('day')}>
          день
        </button>
        <button className={mode === 'week' ? 'on' : ''} onClick={() => setMode('week')}>
          неделя
        </button>
      </div>

      <div className="week" data-enter>
        {week.map((d) => {
          const done = instances.some((i) => i.childId === personId && i.date === d && i.status === 'done')
          return (
            <button
              key={d}
              className={`${d === day ? 'on' : ''} ${d === todayISO() ? 'today' : ''}`}
              onClick={() => {
                setDay(d)
                setMode('day')
              }}
            >
              {dayShort(d)}
              <b>{dayNum(d)}</b>
              {done && <i className="dot" />}
            </button>
          )
        })}
      </div>

      {visible.map(({ inst, task }) =>
        task ? (
          <TaskTicket
            key={inst.id}
            task={task}
            instance={inst}
            actionLabel={inst.date > todayISO() ? undefined : 'Я сделал'}
            onAction={inst.date > todayISO() ? undefined : () => childDone(inst.id)}
            showStamp
          />
        ) : null,
      )}
      {visible.length === 0 && <div className="empty">На этот день дел нет — свободная орбита</div>}
    </PageEnter>
  )
}
