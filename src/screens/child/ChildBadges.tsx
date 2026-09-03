import { PageEnter } from '../../components/PageEnter'
import { BADGES, LEVELS, levelFor } from '../../lib/badges'
import { useApp } from '../../store'

export function ChildBadges() {
  const id = useApp((s) => s.session.personId) ?? 'artem'
  const stats = useApp((s) => s.stats.find((s) => s.childId === id))
  const lvl = levelFor(stats?.lifetime ?? 0)
  const have = new Set(stats?.badges ?? [])

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">серии и уровни</div>
          <h2 className="display">Бейджи</h2>
        </div>
        <div className="coin">{stats?.streak} дн.</div>
      </div>

      <div className="pile" data-enter>
        <div className="eyebrow">уровень {lvl.level}</div>
        <h2 className="display" style={{ fontSize: 24, marginTop: 6 }}>
          {lvl.name}
        </h2>
        <p className="muted">
          {lvl.next
            ? `Ещё ${lvl.next.from - (stats?.lifetime ?? 0)} бонусов до «${lvl.next.name}»`
            : 'Максимальная орбита'}
        </p>
        <div className="level-path">
          {LEVELS.map((l, i) => (
            <div className={`lvl ${l.level <= lvl.level ? 'on' : ''}`} key={l.level}>
              <i />
              <b>
                {i + 1}. {l.name}
              </b>
            </div>
          ))}
        </div>
      </div>

      <h3 data-enter>коллекция печатей</h3>
      <div className="pinboard" data-enter>
        {BADGES.map((b, i) => (
          <div key={b.id}>
            <div
              className={`pin ${have.has(b.id) ? '' : 'locked'}`}
              style={{ transform: `rotate(${i % 2 === 0 ? -10 : 8}deg)` }}
            >
              <div>
                {b.mark}
                <small>{b.name}</small>
              </div>
            </div>
            <div className="badge-cap">{b.hint}</div>
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 14 }} data-enter>
        5 дней подряд — Искра. 10 — Комета. Дальше орбита только шире.
      </p>
    </PageEnter>
  )
}
