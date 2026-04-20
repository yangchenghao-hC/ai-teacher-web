import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { activities } from '../data/mock-data'
import { db, login } from '../cloudbase'
import './ActivityDetail.css'

export default function ActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [act, setAct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const res = await db.collection('events').doc(id).get()
        if (res.data) { setAct(res.data); setLoading(false); return }
      } catch (e) { /* fallback to mock */ }
      const mock = activities.find(a => a.id === id)
      setAct(mock || null)
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="ad-page" style={{ padding: 48, textAlign: 'center' }}>加载中…</div>
  if (!act) return <div className="not-found">活动不存在</div>

  const pct = Math.round(act.enrolled / act.quota * 100)

  return (
    <div className="ad-page">
      {/* Banner */}
      <div className="ad-banner" style={{ background: `linear-gradient(135deg, ${act.color}, ${act.color}99)` }}>
        <div className="ad-banner-content container">
          <button className="ad-back" onClick={() => navigate(-1)}>← 返回活动列表</button>
          <span className="ad-cat">{act.category}</span>
          <h1>{act.title}</h1>
        </div>
      </div>

      {/* Body: content + sidebar */}
      <div className="ad-body container">
        <article className="ad-content">
          <h3>活动详情</h3>
          {act.content.split('\n').map((p, i) => (
            p.trim() ? <p key={i}>{p}</p> : <br key={i} />
          ))}
        </article>

        <aside className="ad-sidebar">
          <div className="ad-info-card">
            <div className="ad-info-row"><span className="ad-info-label">🕐 时间</span><span>{act.time}</span></div>
            <div className="ad-info-row"><span className="ad-info-label">📍 地点</span><span>{act.location}</span></div>
            <div className="ad-info-row"><span className="ad-info-label">🏢 主办</span><span>{act.organizer}</span></div>
            <div className="ad-info-row"><span className="ad-info-label">⏰ 截止</span><span>{act.deadline}</span></div>

            <div className="ad-progress">
              <div className="ad-bar">
                <div className="ad-fill" style={{ width: `${pct}%`, background: act.color }} />
              </div>
              <div className="ad-progress-label">
                <span>已报名 {act.enrolled} 人</span>
                <span>共 {act.quota} 个名额</span>
              </div>
            </div>

            <button
              className={`ad-enroll${enrolled ? ' enrolled' : ''}`}
              style={{ background: enrolled ? 'var(--bg)' : act.color }}
              onClick={() => setEnrolled(!enrolled)}
            >
              {enrolled ? '取消报名' : '立即报名'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
