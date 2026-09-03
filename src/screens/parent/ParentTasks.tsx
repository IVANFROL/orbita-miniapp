import { useMemo, useState } from 'react'
import { PageEnter } from '../../components/PageEnter'
import { Sheet } from '../../components/Sheet'
import { TaskTicket } from '../../components/TaskTicket'
import { todayISO } from '../../lib/dates'
import { useApp, useKids } from '../../store'
import type { Task, TaskCategory } from '../../types'

const DAY_L = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

const emptyForm = {
  title: '',
  category: 'chore' as TaskCategory,
  cost: 20,
  days: [0, 1, 2, 3, 4],
  childId: 'artem',
}

export function ParentTasks() {
  const viewing = useApp((s) => s.session.viewingChildId)
  const viewChild = useApp((s) => s.viewChild)
  const kids = useKids()
  const tasks = useApp((s) => s.tasks)
  const instances = useApp((s) => s.instances)
  const addTask = useApp((s) => s.addTask)
  const updateTask = useApp((s) => s.updateTask)
  const removeTask = useApp((s) => s.removeTask)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const list = tasks.filter((t) => t.childId === viewing)
  const todayMap = useMemo(() => {
    const map: Record<string, (typeof instances)[0]> = {}
    for (const i of instances) {
      if (i.date === todayISO()) map[i.taskId] = i
    }
    return map
  }, [instances])

  function startNew() {
    setEditId(null)
    setForm({ ...emptyForm, childId: viewing })
    setOpen(true)
  }

  function startEdit(t: Task) {
    setEditId(t.id)
    setForm({
      title: t.title,
      category: t.category,
      cost: t.cost,
      days: t.days,
      childId: t.childId,
    })
    setOpen(true)
  }

  function save() {
    if (!form.title.trim()) return
    if (editId) updateTask(editId, form)
    else addTask(form)
    setOpen(false)
  }

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">расписание</div>
          <h2 className="display">Дела</h2>
        </div>
        <button className="btn tiny solid" style={{ width: 'auto' }} onClick={startNew}>
          + задача
        </button>
      </div>
      <div className="kids-row" data-enter>
        {kids.map((k) => (
          <button key={k.id} className={`kid-chip ${viewing === k.id ? 'on' : ''}`} onClick={() => viewChild(k.id)}>
            <div className="avatar" style={{ background: k.color }}>
              {k.initial}
            </div>
            <b>{k.name}</b>
            <span>{list.length && viewing === k.id ? `${list.length} дел` : 'открыть'}</span>
          </button>
        ))}
      </div>

      {list.map((t) => {
        const inst = todayMap[t.id] ?? {
          id: t.id,
          taskId: t.id,
          childId: t.childId,
          date: todayISO(),
          status: 'todo' as const,
        }
        return (
          <div key={t.id} onClick={() => startEdit(t)}>
            <TaskTicket task={t} instance={inst} showStamp />
          </div>
        )
      })}

      {open && (
        <Sheet title={editId ? 'Править задачу' : 'Новая задача'} onClose={() => setOpen(false)}>
          <div className="field">
            <label>название</label>
            <input
              value={form.title}
              placeholder="Вынести мусор"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="seg">
            <button className={form.category === 'chore' ? 'on' : ''} onClick={() => setForm({ ...form, category: 'chore' })}>
              обязанность
            </button>
            <button
              className={form.category === 'homework' ? 'on' : ''}
              onClick={() => setForm({ ...form, category: 'homework' })}
            >
              домашка
            </button>
          </div>
          <div className="field">
            <label>стоимость в бонусах</label>
            <div className="stepper">
              <button onClick={() => setForm({ ...form, cost: Math.max(5, form.cost - 5) })}>−</button>
              <b>{form.cost}</b>
              <button onClick={() => setForm({ ...form, cost: form.cost + 5 })}>+</button>
            </div>
          </div>
          <div className="field">
            <label>дни</label>
            <div className="days">
              {DAY_L.map((d, i) => (
                <button
                  key={d}
                  className={form.days.includes(i) ? 'on' : ''}
                  onClick={() =>
                    setForm({
                      ...form,
                      days: form.days.includes(i) ? form.days.filter((x) => x !== i) : [...form.days, i].sort(),
                    })
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button className="btn solid" onClick={save}>
            Сохранить
          </button>
          {editId && (
            <button
              className="btn ghost"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => {
                removeTask(editId)
                setOpen(false)
              }}
            >
              Удалить
            </button>
          )}
        </Sheet>
      )}
    </PageEnter>
  )
}
