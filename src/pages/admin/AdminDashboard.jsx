import { useState, useEffect } from 'react'
import { adminCount } from '../../utils/admin-api'

const CARDS = [
  { key: 'banners', label: 'Banner', icon: '🖼️', bg: '#EFF4FF', color: '#4F7CFF' },
  { key: 'courses', label: '课程', icon: '📚', bg: '#F0FFF4', color: '#52C41A' },
  { key: 'news', label: '资讯', icon: '📰', bg: '#FFF0F6', color: '#EB2F96' },
  { key: 'events', label: '活动', icon: '🎯', bg: '#FFF7E6', color: '#FA8C16' },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    async function load() {
      const result = {}
      await Promise.all(
        CARDS.map(async c => {
          try { result[c.key] = await adminCount(c.key) }
          catch { result[c.key] = '-' }
        })
      )
      if (alive) { setCounts(result); setLoading(false) }
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <>
      <div className="admin-stats">
        {CARDS.map(c => (
          <div className="stat-card" key={c.key}>
            <div className="stat-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div>
              <div className="stat-value">{loading ? '…' : counts[c.key]}</div>
              <div className="stat-label">{c.label}总数</div>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-table-wrap">
        <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          👋 欢迎使用师学通管理后台<br />
          <span style={{ fontSize: 13, marginTop: 8, display: 'inline-block' }}>
            使用左侧导航管理 Banner、课程、资讯和活动内容，web 端和小程序端数据实时同步。
          </span>
        </div>
      </div>
    </>
  )
}
