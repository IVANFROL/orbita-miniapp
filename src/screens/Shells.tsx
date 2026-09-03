import { Navigate, Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { useApp } from '../store'

export function ParentShell() {
  const role = useApp((s) => s.session.role)
  if (role !== 'parent') return <Navigate to="/" replace />
  return (
    <>
      <Outlet />
      <BottomNav role="parent" />
    </>
  )
}

export function ChildShell() {
  const role = useApp((s) => s.session.role)
  if (role !== 'child') return <Navigate to="/" replace />
  return (
    <>
      <Outlet />
      <BottomNav role="child" />
    </>
  )
}
