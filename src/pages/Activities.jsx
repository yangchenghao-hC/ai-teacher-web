import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { activities as mockActivities, activityCategories } from '../data/mock-data'
import { db, login } from '../cloudbase'
import './Activities.css'

export default function Activities() {
  const navigate = useNavigate()
  const [cat, setCat] = useState('全部')
  const [allActivities, setAllActivities] = useState(mockActivities)

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const res = await db.collection('events').orderBy('createdAt', 'desc').limit(100).get()
        if (res.data && res.data.length > 0) {
          setAllActivities(res.data.map(a => ({ ...a, id: a._id })))
        }
      } catch (e) { console.warn('events 云端加载失败，使用本地数据', e) }
    })()
  }, [])

  const list = allActivities.filter(a => cat === '全部' || a.category === cat)

  return (
    <div className="act-page">
      <div className="section container">
        <div className="act-header">
          <h1>活动报名</h1>
          <p>参与丰富的校园活动，提升教学实践能力</p>
        </div>

        <div className="act-tabs">
          {activityCategories.map(c => (
            <button key={c} className={`act-tab${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="act-grid">
          {list.map(a => {
            const pct = Math.round(a.enrolled / a.quota * 100)
            return (
              <div className="act-card" key={a.id} onClick={() => navigate(`/activities/${a.id}`)}>
                <div className="act-card-top" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}88)` }}>
                  <span className="act-card-cat">{a.category}</span>
                  <span className="act-card-deadline">截止 {a.deadline}</span>
                </div>
                <div className="act-card-body">
                  <h3>{a.title}</h3>
                  <p className="act-meta">🕐 {a.time}</p>
                  <p className="act-meta">📍 {a.location}</p>
                  <div className="act-progress">
                    <div className="act-bar">
                      <div className="act-fill" style={{ width: `${pct}%`, background: a.color }} />
                    </div>
                    <span className="act-count">{a.enrolled}/{a.quota}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
