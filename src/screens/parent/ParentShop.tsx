import { useState } from 'react'
import { PageEnter } from '../../components/PageEnter'
import { RewardIcon } from '../../components/RewardIcon'
import { Sheet } from '../../components/Sheet'
import { useApp, useKids } from '../../store'

export function ParentShop() {
  const rewards = useApp((s) => s.rewards)
  const addReward = useApp((s) => s.addReward)
  const removeReward = useApp((s) => s.removeReward)
  const purchases = useApp((s) => s.purchases)
  const people = useApp((s) => s.people)
  const settle = useApp((s) => s.settlePurchase)
  const kids = useKids()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', hint: '', cost: 50, icon: 'ice' })

  const pending = purchases.filter((p) => p.status === 'pending')

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">реальные поощрения</div>
          <h2 className="display">Магазин</h2>
        </div>
        <button className="btn tiny solid" style={{ width: 'auto' }} onClick={() => setOpen(true)}>
          + награда
        </button>
      </div>

      {pending.length > 0 && (
        <div className="pile" data-enter style={{ marginBottom: 14 }}>
          <header>
            <b>Ждут согласия</b>
          </header>
          {pending.map((p) => {
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
                    {kid?.name} · {r?.cost}
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

      <div className="shop">
        {rewards.map((r) => (
          <article className="reward" key={r.id} data-enter>
            <div className="ico">
              <RewardIcon name={r.icon} />
            </div>
            <h4>{r.title}</h4>
            <p>{r.hint}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div className="price-tag">{r.cost}</div>
              <button className="btn tiny ghost" onClick={() => removeReward(r.id)}>
                ×
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 12 }} data-enter>
        {kids.map((k) => k.name).join(' и ')} видят этот же прилавок.
      </p>

      {open && (
        <Sheet title="Новая награда" onClose={() => setOpen(false)}>
          <div className="field">
            <label>название</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="field">
            <label>как выдаёте</label>
            <input value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })} />
          </div>
          <div className="field">
            <label>цена</label>
            <div className="stepper">
              <button onClick={() => setForm({ ...form, cost: Math.max(10, form.cost - 10) })}>−</button>
              <b>{form.cost}</b>
              <button onClick={() => setForm({ ...form, cost: form.cost + 10 })}>+</button>
            </div>
          </div>
          <button
            className="btn solid"
            onClick={() => {
              if (!form.title.trim()) return
              addReward(form)
              setOpen(false)
              setForm({ title: '', hint: '', cost: 50, icon: 'ice' })
            }}
          >
            В магазин
          </button>
        </Sheet>
      )}
    </PageEnter>
  )
}
