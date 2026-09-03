import type { Task, TaskInstance } from '../types'
import { categoryLabel } from '../store'

const ROT = ['-1.2deg', '1deg', '-0.6deg', '1.4deg', '0deg']

export function TaskTicket({
  task,
  instance,
  actionLabel,
  onAction,
  showStamp,
}: {
  task: Task
  instance: TaskInstance
  actionLabel?: string
  onAction?: () => void
  showStamp?: boolean
}) {
  const rot = ROT[task.title.length % ROT.length]
  return (
    <article className={`ticket ${instance.status}`} style={{ ['--rot' as string]: rot }} data-enter>
      {showStamp && instance.status === 'done' && <div className="stamp">зачёт</div>}
      <div className="ticket-inner">
        <div className="ticket-body">
          <span className={`tag ${task.category}`}>{categoryLabel(task.category)}</span>
          <h4>{task.title}</h4>
          <p>
            {instance.status === 'awaiting' && 'Ждёт подтверждения'}
            {instance.status === 'todo' && 'Ещё на орбите'}
            {instance.status === 'done' && 'Принято родителями'}
            {instance.status === 'rejected' && 'Нужно переделать'}
          </p>
          {actionLabel && onAction && instance.status !== 'done' && instance.status !== 'awaiting' && (
            <button className="btn tiny comet" style={{ marginTop: 8, width: 'auto' }} onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
        <div className="ticket-cost">
          <div>
            <b>{task.cost}</b>
            <span>бонус</span>
          </div>
        </div>
      </div>
    </article>
  )
}
