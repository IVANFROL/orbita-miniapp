import { FillBar } from '../../components/FillBar'
import { PageEnter } from '../../components/PageEnter'
import { periodLabel, useApp } from '../../store'

export function ChildGoals() {
  const id = useApp((s) => s.session.personId) ?? 'artem'
  const stats = useApp((s) => s.stats.find((s) => s.childId === id))
  const goals = useApp((s) => s.goals.filter((g) => g.childId === id))

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">куда летим</div>
          <h2 className="display">Цели</h2>
        </div>
        <div className="coin">★ {stats?.balance}</div>
      </div>
      {goals.map((g) => {
        const pct = Math.min(100, Math.round(((stats?.balance ?? 0) / g.cost) * 100))
        const left = Math.max(0, g.cost - (stats?.balance ?? 0))
        return (
          <article className={`goal-card ${g.period}`} key={g.id} data-enter>
            <div className="eyebrow">{periodLabel(g.period)}</div>
            <h2 className="display" style={{ fontSize: 26, marginTop: 8 }}>
              {g.title}
            </h2>
            <div className="bar">
              <FillBar pct={pct} />
            </div>
            <div className="muted">
              {stats?.balance} из {g.cost} · ещё {left} бонусов
            </div>
            {g.rewardTitle && (
              <p style={{ margin: '10px 0 0', fontWeight: 800 }}>Приз: {g.rewardTitle}</p>
            )}
          </article>
        )
      })}
      <p className="muted" data-enter>
        Цели ставит семья вместе. Когда счёт долетит — мама или папа выдадут награду.
      </p>
    </PageEnter>
  )
}
