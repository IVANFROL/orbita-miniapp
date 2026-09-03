import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageEnter } from '../../components/PageEnter'
import { Sheet } from '../../components/Sheet'
import { todayISO } from '../../lib/dates'
import { useApp, useKids, useParents } from '../../store'

export function ParentHome() {
  const personId = useApp((s) => s.session.personId)
  const me = useApp((s) => s.people.find((p) => p.id === personId))
  const kids = useKids()
  const parents = useParents()
  const viewing = useApp((s) => s.session.viewingChildId)
  const viewChild = useApp((s) => s.viewChild)
  const instances = useApp((s) => s.instances)
  const tasks = useApp((s) => s.tasks)
  const people = useApp((s) => s.people)
  const stats = useApp((s) => s.stats)
  const parentCheck = useApp((s) => s.parentCheck)
  const purchases = useApp((s) => s.purchases)
  const rewards = useApp((s) => s.rewards)
  const settle = useApp((s) => s.settlePurchase)
  const invite = useApp((s) => s.inviteChild)
  const inviteP = useApp((s) => s.inviteParent)
  const logout = useApp((s) => s.logout)
  const resetDemo = useApp((s) => s.resetDemo)
  const [inviteOpen, setInviteOpen] = useState(false)

  const awaiting = useMemo(
    () =>
      instances.filter((i) => i.status === 'awaiting' && i.childId === viewing),
    [instances, viewing],
  )
  const pendingBuy = purchases.filter((p) => p.status === 'pending')
  const child = people.find((p) => p.id === viewing)
  const st = stats.find((s) => s.childId === viewing)

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">{me?.relation === 'папа' ? 'Папа на связи' : 'Мама на связи'}</div>
          <h2 className="display">{me?.name}</h2>
        </div>
        <button className="coin" onClick={() => setInviteOpen(true)}>
          + семья
        </button>
      </div>

      <div className="kids-row" data-enter>
        {kids.map((k) => {
          const cs = stats.find((s) => s.childId === k.id)
          return (
            <button key={k.id} className={`kid-chip ${viewing === k.id ? 'on' : ''}`} onClick={() => viewChild(k.id)}>
              <div className="avatar" style={{ background: k.color }}>
                {k.initial}
              </div>
              <b>{k.name}</b>
              <span>{cs?.balance} бон.</span>
            </button>
          )
        })}
      </div>

      <div className="pile" data-enter>
        <header>
          <b>Чек на сегодня</b>
          <span className="muted">{awaiting.length || 'пусто'}</span>
        </header>
        {awaiting.length === 0 && <div className="empty">Пока никто не нажал «я сделал»</div>}
        {awaiting.map((i) => {
          const t = tasks.find((x) => x.id === i.taskId)
          if (!t) return null
          const kid = people.find((p) => p.id === i.childId)
          return (
            <div className="check-item" key={i.id}>
              <div className="avatar" style={{ background: kid?.color }}>
                {kid?.initial}
              </div>
              <div>
                <b>{t.title}</b>
                <div className="muted">
                  {kid?.name} · {t.cost} бон.
                </div>
              </div>
              <div className="row-btns">
                <button className="btn tiny ok" onClick={() => parentCheck(i.id, true)}>
                  ок
                </button>
                <button className="btn tiny no" onClick={() => parentCheck(i.id, false)}>
                  нет
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {pendingBuy.length > 0 && (
        <div className="pile" data-enter style={{ marginTop: 12 }}>
          <header>
            <b>Покупки ждут согласия</b>
          </header>
          {pendingBuy.map((p) => {
            const r = rewards.find((x) => x.id === p.rewardId)
            const kid = people.find((x) => x.id === p.childId)
            return (
              <div className="check-item" key={p.id}>
                <div className="avatar" style={{ background: kid?.color }}>
                  {kid?.initial}
                </div>
                <div>
                  <b>{r?.title}</b>
                  <div className="muted">
                    {kid?.name} · {r?.cost} бон.
                  </div>
                </div>
                <div className="row-btns">
                  <button className="btn tiny ok" onClick={() => settle(p.id, true)}>
                    дать
                  </button>
                  <button className="btn tiny no" onClick={() => settle(p.id, false)}>
                    нет
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <h3 data-enter>Сегодня · {child?.name}</h3>
      <div className="stats-grid" data-enter>
        <div className="stat">
          <span className="muted">на счёте</span>
          <b>{st?.balance}</b>
        </div>
        <div className="stat">
          <span className="muted">серия дней</span>
          <b>{st?.streak}</b>
        </div>
      </div>

      <div className="pile" style={{ marginTop: 14 }} data-enter>
        <header>
          <b>Кто видит прогресс</b>
          <button className="btn tiny ghost" onClick={() => setInviteOpen(true)}>
            код
          </button>
        </header>
        <div className="family">
          {parents.map((p) => (
            <div className="pill" key={p.id}>
              <div className="avatar" style={{ width: 22, height: 22, fontSize: 10, background: p.color, margin: 0 }}>
                {p.initial}
              </div>
              {p.name}
            </div>
          ))}
        </div>
        <p className="muted" style={{ margin: '10px 0 0' }}>
          Мама и папа смотрят одну орбиту. Сегодня {todayISO()}.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }} data-enter>
        <Link to="/parent/tasks" className="btn solid" style={{ flex: 1 }}>
          К задачам
        </Link>
        <Link to="/parent/stats" className="btn ghost" style={{ flex: 1 }}>
          путь
        </Link>
        <button className="btn ghost" onClick={logout}>
          выйти
        </button>
      </div>

      {inviteOpen && (
        <Sheet title="Пригласить в семью" onClose={() => setInviteOpen(false)}>
          <p className="muted">Ребёнок входит по ссылке от родителя. В демо — код:</p>
          <div className="code" style={{ margin: '10px 0 16px' }}>
            {invite}
          </div>
          <p className="muted">Второй родитель (мама или папа):</p>
          <div className="code" style={{ margin: '10px 0 16px' }}>
            {inviteP}
          </div>
          <button className="btn solid" onClick={() => setInviteOpen(false)}>
            Понятно
          </button>
          <button className="btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={resetDemo}>
            Сбросить демо-данные
          </button>
        </Sheet>
      )}
    </PageEnter>
  )
}
