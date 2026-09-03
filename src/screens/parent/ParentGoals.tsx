import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageEnter } from '../../components/PageEnter'
import { FillBar } from '../../components/FillBar'
import { Sheet } from '../../components/Sheet'
import { periodLabel, useApp, useKids } from '../../store'
import type { Goal, GoalPeriod } from '../../types'

export function ParentGoals() {
  const viewing = useApp((s) => s.session.viewingChildId)
  const viewChild = useApp((s) => s.viewChild)
  const kids = useKids()
  const goals = useApp((s) => s.goals)
  const stats = useApp((s) => s.stats)
  const saveGoal = useApp((s) => s.saveGoal)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | undefined>()
  const [form, setForm] = useState({
    title: '',
    cost: 500,
    rewardTitle: '',
    period: 'month' as GoalPeriod,
  })

  const mine = goals.filter((g) => g.childId === viewing)
  const st = stats.find((s) => s.childId === viewing)

  function start(g?: Goal, period: GoalPeriod = 'month') {
    if (g) {
      setEditId(g.id)
      setForm({
        title: g.title,
        cost: g.cost,
        rewardTitle: g.rewardTitle ?? '',
        period: g.period,
      })
    } else {
      setEditId(undefined)
      setForm({ title: '', cost: period === 'year' ? 2000 : 500, rewardTitle: '', period })
    }
    setOpen(true)
  }

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">вместе с ребёнком</div>
          <h2 className="display">Цели</h2>
        </div>
        <button className="btn tiny solid" style={{ width: 'auto' }} onClick={() => start()}>
          + цель
        </button>
      </div>
      <div className="kids-row" data-enter>
        {kids.map((k) => (
          <button key={k.id} className={`kid-chip ${viewing === k.id ? 'on' : ''}`} onClick={() => viewChild(k.id)}>
            <div className="avatar" style={{ background: k.color }}>
              {k.initial}
            </div>
            <b>{k.name}</b>
            <span>месяц и год</span>
          </button>
        ))}
      </div>

      {(['month', 'year'] as const).map((period) => {
        const g = mine.find((x) => x.period === period)
        const pct = g && st ? Math.min(100, Math.round((st.balance / g.cost) * 100)) : 0
        return (
          <article key={period} className={`goal-card ${period}`} data-enter onClick={() => (g ? start(g) : start(undefined, period))}>
            <div className="eyebrow">{periodLabel(period)}</div>
            <h2 className="display" style={{ fontSize: 24, marginTop: 6 }}>
              {g?.title ?? 'Поставить цель'}
            </h2>
            {g ? (
              <>
                <div className="bar">
                  <FillBar pct={pct} />
                </div>
                <div className="muted">
                  {st?.balance} из {g.cost} · награда: {g.rewardTitle}
                </div>
              </>
            ) : (
              <p className="muted">Нажмите, чтобы выбрать цель на {periodLabel(period)}</p>
            )}
          </article>
        )
      })}

      {open && (
        <Sheet title={editId ? 'Править цель' : 'Новая цель'} onClose={() => setOpen(false)}>
          <div className="seg">
            <button className={form.period === 'month' ? 'on' : ''} onClick={() => setForm({ ...form, period: 'month' })}>
              месяц
            </button>
            <button className={form.period === 'year' ? 'on' : ''} onClick={() => setForm({ ...form, period: 'year' })}>
              год
            </button>
          </div>
          <div className="field">
            <label>что копим</label>
            <input
              value={form.title}
              placeholder="Новый велосипед"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label>нужно бонусов</label>
            <div className="stepper">
              <button onClick={() => setForm({ ...form, cost: Math.max(50, form.cost - 50) })}>−</button>
              <b>{form.cost}</b>
              <button onClick={() => setForm({ ...form, cost: form.cost + 50 })}>+</button>
            </div>
          </div>
          <div className="field">
            <label>награда за цель</label>
            <input
              value={form.rewardTitle}
              placeholder="Велосипед Stels"
              onChange={(e) => setForm({ ...form, rewardTitle: e.target.value })}
            />
          </div>
          <button
            className="btn solid"
            onClick={() => {
              if (!form.title.trim()) return
              saveGoal({ id: editId, childId: viewing, ...form })
              setOpen(false)
            }}
          >
            Сохранить
          </button>
        </Sheet>
      )}
      <Link to="/parent/stats" className="btn ghost" style={{ width: '100%', marginTop: 8 }} data-enter>
        Статистика за неделю
      </Link>
    </PageEnter>
  )
}
