import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Toasts } from './components/Toasts'
import { ChildBadges } from './screens/child/ChildBadges'
import { ChildGoals } from './screens/child/ChildGoals'
import { ChildHome } from './screens/child/ChildHome'
import { ChildShop } from './screens/child/ChildShop'
import { ParentGoals } from './screens/parent/ParentGoals'
import { ParentHome } from './screens/parent/ParentHome'
import { ParentShop } from './screens/parent/ParentShop'
import { ParentStats } from './screens/parent/ParentStats'
import { ParentTasks } from './screens/parent/ParentTasks'
import { ChildShell, ParentShell } from './screens/Shells'
import { Welcome } from './screens/Welcome'
import { initTelegram } from './lib/telegram'
import { useApp } from './store'

export default function App() {
  const [ready, setReady] = useState(useApp.persist.hasHydrated())

  useEffect(() => {
    initTelegram()
    const done = () => {
      useApp.getState().ensureWeek()
      setReady(true)
    }
    if (useApp.persist.hasHydrated()) done()
    return useApp.persist.onFinishHydration(done)
  }, [])

  return (
    <HashRouter>
      <div className="stage">
        <div className="device">
          <TgBar />
          <div className="app">
            {ready ? (
              <>
                <Toasts />
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/parent" element={<ParentShell />}>
                    <Route index element={<ParentHome />} />
                    <Route path="tasks" element={<ParentTasks />} />
                    <Route path="goals" element={<ParentGoals />} />
                    <Route path="shop" element={<ParentShop />} />
                    <Route path="stats" element={<ParentStats />} />
                  </Route>
                  <Route path="/child" element={<ChildShell />}>
                    <Route index element={<ChildHome />} />
                    <Route path="goals" element={<ChildGoals />} />
                    <Route path="shop" element={<ChildShop />} />
                    <Route path="badges" element={<ChildBadges />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </>
            ) : (
              <div className="welcome">
                <div className="brand">
                  <h1>Орбита</h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HashRouter>
  )
}

function TgBar() {
  const session = useApp((s) => s.session)
  const login = useApp((s) => s.login)
  const nav = useNavigate()
  const kids = useApp((s) => s.people.filter((p) => p.role === 'child'))

  useGSAP(() => {
    gsap.from('.tg-bar', { y: -12, opacity: 0, duration: 0.4 })
  })

  return (
    <header className="tg-bar">
      <span className="tg-ico">✕</span>
      <b>Орбита</b>
      {session.role ? (
        <div className="demo-switch">
          <button
            className={session.role === 'parent' ? 'on' : ''}
            onClick={() => {
              login('parent', session.personId && session.role === 'parent' ? session.personId : 'maria')
              nav('/parent')
            }}
          >
            родитель
          </button>
          <button
            className={session.role === 'child' ? 'on' : ''}
            onClick={() => {
              const id = session.viewingChildId || kids[0]?.id || 'artem'
              login('child', session.role === 'child' && session.personId ? session.personId : id)
              nav('/child')
            }}
          >
            ребёнок
          </button>
        </div>
      ) : (
        <span className="tg-ico">···</span>
      )}
    </header>
  )
}
