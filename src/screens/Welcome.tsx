import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CometArt } from '../components/CometArt'
import { useApp, useKids, useParents } from '../store'

export function Welcome() {
  const login = useApp((s) => s.login)
  const role = useApp((s) => s.session.role)
  const parents = useParents()
  const kids = useKids()
  const nav = useNavigate()
  const [pick, setPick] = useState<'parent' | 'child' | null>(null)

  if (role === 'parent') return <Navigate to="/parent" replace />
  if (role === 'child') return <Navigate to="/child" replace />

  return (
    <div className="welcome">
      <div className="sky" />
      <div className="brand" data-enter>
        <div className="eyebrow">Telegram Mini App · демо</div>
        <h1>Орбита</h1>
        <p>Ребёнок делает дела — копится путь к цели, которую вы поставили вместе.</p>
      </div>
      <CometArt />
      {!pick && (
        <div className="roles">
          <button className="role-card parent" onClick={() => setPick('parent')}>
            <div className="role-mark">Р</div>
            <div>
              <strong>Я родитель</strong>
              <small>Задачи, чек, цели и магазин наград</small>
            </div>
            →
          </button>
          <button className="role-card child" onClick={() => setPick('child')}>
            <div className="role-mark">★</div>
            <div>
              <strong>Я ребёнок</strong>
              <small>Сегодняшние дела, орбита и бейджи</small>
            </div>
            →
          </button>
        </div>
      )}
      {pick === 'parent' && (
        <div className="roles">
          <div className="eyebrow">вход по номеру · демо-семья</div>
          <div className="people-pick">
            {parents.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  login('parent', p.id)
                  nav('/parent')
                }}
              >
                <span>
                  {p.name} · {p.relation}
                </span>
                <span style={{ color: '#8a7360' }}>+7 916 ···-45</span>
              </button>
            ))}
          </div>
          <button className="btn ghost" onClick={() => setPick(null)}>
            назад
          </button>
        </div>
      )}
      {pick === 'child' && (
        <div className="roles">
          <div className="eyebrow">приглашение от родителя · {useApp.getState().inviteChild}</div>
          <div className="people-pick">
            {kids.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  login('child', p.id)
                  nav('/child')
                }}
              >
                <span>
                  {p.name}, {p.age} лет
                </span>
                <span style={{ color: '#8a7360' }}>войти</span>
              </button>
            ))}
          </div>
          <button className="btn ghost" onClick={() => setPick(null)}>
            назад
          </button>
        </div>
      )}
    </div>
  )
}
