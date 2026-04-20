import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { campusNews } from '../data/mock-data'
import { db, login } from '../cloudbase'
import './NewsDetail.css'

export default function NewsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const res = await db.collection('news').doc(id).get()
        if (res.data) { setNews(res.data); setLoading(false); return }
      } catch (e) { /* fallback to mock */ }
      const mock = campusNews.find(n => n.id === id)
      setNews(mock || null)
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="nd-page" style={{ padding: 48, textAlign: 'center' }}>加载中…</div>
  if (!news) return <div className="not-found">资讯不存在</div>

  return (
    <div className="nd-page">
      {/* Colored header banner */}
      <div className="nd-banner" style={{ background: `linear-gradient(135deg, ${news.color}, ${news.color}99)` }}>
        <div className="nd-banner-content container">
          <button className="nd-back" onClick={() => navigate(-1)}>← 返回资讯列表</button>
          <span className="nd-cat">{news.category}</span>
          <h1>{news.title}</h1>
          <span className="nd-time">{news.time}</span>
        </div>
      </div>
      {/* Article body */}
      <div className="nd-body">
        <article className="nd-article">
          {news.content.split('\n').map((p, i) => (
            p.trim() ? <p key={i}>{p}</p> : <br key={i} />
          ))}
        </article>
      </div>
    </div>
  )
}
