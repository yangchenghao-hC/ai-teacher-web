import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { campusNews as mockNews, newsCategories } from '../data/mock-data'
import { db, login } from '../cloudbase'
import './CampusNews.css'

export default function CampusNews() {
  const navigate = useNavigate()
  const [cat, setCat] = useState('全部')
  const [allNews, setAllNews] = useState(mockNews)

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const res = await db.collection('news').orderBy('time', 'desc').limit(100).get()
        if (res.data && res.data.length > 0) {
          setAllNews(res.data.map(n => ({ ...n, id: n._id })))
        }
      } catch (e) { console.warn('news 云端加载失败，使用本地数据', e) }
    })()
  }, [])

  const list = allNews.filter(n => cat === '全部' || n.category === cat)
  const featured = list[0]
  const rest = list.slice(1)

  return (
    <div className="news-page">
      <div className="section container">
        <div className="news-header">
          <h1>校园资讯</h1>
          <p>了解校园最新动态与教育前沿信息</p>
        </div>

        <div className="news-tabs">
          {newsCategories.map(c => (
            <button key={c} className={`news-tab${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Featured card */}
        {featured && (
          <div className="featured-card" onClick={() => navigate(`/news/${featured.id}`)}>
            <div className="featured-color" style={{ background: `linear-gradient(135deg, ${featured.color}, ${featured.color}99)` }}>
              <span className="featured-cat">{featured.category}</span>
            </div>
            <div className="featured-body">
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
              <span className="featured-time">{featured.time}</span>
            </div>
          </div>
        )}

        {/* Card grid */}
        <div className="news-grid">
          {rest.map(n => (
            <div className="news-card" key={n.id} onClick={() => navigate(`/news/${n.id}`)}>
              <div className="news-accent" style={{ background: n.color }} />
              <div className="news-card-body">
                <span className="news-cat" style={{ color: n.color }}>{n.category}</span>
                <h3>{n.title}</h3>
                <p>{n.summary}</p>
                <span className="news-time">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
