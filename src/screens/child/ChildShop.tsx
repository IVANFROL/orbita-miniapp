import { PageEnter } from '../../components/PageEnter'
import { RewardIcon } from '../../components/RewardIcon'
import { useApp } from '../../store'

export function ChildShop() {
  const id = useApp((s) => s.session.personId) ?? 'artem'
  const stats = useApp((s) => s.stats.find((s) => s.childId === id))
  const rewards = useApp((s) => s.rewards)
  const buy = useApp((s) => s.buy)
  const purchases = useApp((s) => s.purchases.filter((p) => p.childId === id))
  const me = useApp((s) => s.people.find((p) => p.id === id))

  return (
    <PageEnter>
      <div className="top" data-enter>
        <div>
          <div className="hello">на что потратить</div>
          <h2 className="display">Прилавок</h2>
        </div>
        <div className="coin">★ {stats?.balance}</div>
      </div>

      {purchases.filter((p) => p.status === 'pending').length > 0 && (
        <div className="pile" data-enter style={{ marginBottom: 14 }}>
          <b>Ждём согласия родителей</b>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            Бот уже написал маме и папе.
          </p>
        </div>
      )}

      <div className="shop">
        {rewards.map((r) => {
          const can = (stats?.balance ?? 0) >= r.cost
          return (
            <article className={`reward ${can ? '' : 'locked'}`} key={r.id} data-enter>
              <div className="ico">
                <RewardIcon name={r.icon} />
              </div>
              <h4>{r.title}</h4>
              <p>{r.hint}</p>
              <div className="price-tag">{r.cost}</div>
              <button
                className="btn tiny solid"
                style={{ width: '100%', marginTop: 8 }}
                disabled={!can}
                onClick={() => buy(id, r.id)}
              >
                {can ? 'Хочу' : 'мало ★'}
              </button>
            </article>
          )
        })}
      </div>
      <p className="muted" style={{ marginTop: 12 }} data-enter>
        {me?.name}, покупка списывает бонусы сразу. Если родители скажут «нет» — звёзды вернутся.
      </p>
    </PageEnter>
  )
}
