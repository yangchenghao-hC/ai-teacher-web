import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { banners as mockBanners, quickEntries, learningStats, recommendCourses as mockRecommend, recentStudies } from '../data/mock-data'
import { db, login } from '../cloudbase'
import { loadCoverUrls } from '../utils/upload'
import './Home.css'

const features = [
  { id: 'courses', emoji: '📚', title: '专题课堂', desc: '覆盖学前到大学阶段的精品师范课程', color: '#4F7CFF', url: '/courses' },
  { id: 'openmaic', emoji: '🤖', title: 'AI 互动课堂', desc: '多智能体协作，沉浸式课堂模拟', color: '#7B68EE', url: '/openmaic' },
  { id: 'ai', emoji: '💬', title: 'AI 教学助手', desc: '教案设计、学情分析、面试模拟', color: '#52C41A', url: '/ai-chat' },
  { id: 'news', emoji: '📰', title: '校园资讯', desc: '新闻通知、讲座活动一站掌握', color: '#EB2F96', url: '/news' }
]

export default function Home() {
  const navigate = useNavigate()
  const [bannerIdx, setBannerIdx] = useState(0)
  const [banners, setBanners] = useState(mockBanners)
  const [recommendCourses, setRecommendCourses] = useState(mockRecommend)

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const [bRes, cRes] = await Promise.all([
          db.collection('banners').where({ enabled: true }).orderBy('sort', 'asc').limit(10).get(),
          db.collection('courses').limit(10).get()
        ])
        if (bRes.data && bRes.data.length > 0) setBanners(bRes.data)
        if (cRes.data && cRes.data.length > 0) {
          const withCovers = await loadCoverUrls(cRes.data)
          setRecommendCourses(withCovers.map(c => ({ ...c, id: c._id })))
        }
      } catch (e) { console.warn('首页云端加载失败，使用本地数据', e) }
    })()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  return (
    <div className="home-page">
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content container">
          <h1>AI 赋能教师教育<br /><span>学习，从此不同</span></h1>
          <p className="hero-desc">
            融合人工智能与教育科学，为师范生打造智能学习平台。
            精品课程、AI 互动课堂、智能助手 — 一站式提升教学素养。
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/courses')}>
              探索课程
            </button>
            <button className="btn-outline" onClick={() => navigate('/ai-chat')}>
              体验 AI 助手
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{learningStats.completedCourses}+</strong>
              <span>精品课程</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>3,256+</strong>
              <span>在学师范生</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>6</strong>
              <span>AI 教学场景</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features Grid ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>平台特色</h2>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div
                className="feature-card"
                key={f.id}
                onClick={() => navigate(f.url)}
              >
                <div className="feature-icon" style={{ background: `${f.color}12` }}>
                  <span>{f.emoji}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-arrow" style={{ color: f.color }}>了解更多 →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Continue Learning ===== */}
      {recentStudies.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-card)' }}>
          <div className="container">
            <div className="section-header">
              <h2>继续学习</h2>
              <span className="section-link" onClick={() => navigate('/courses')}>查看全部 →</span>
            </div>
            <div className="recent-grid">
              {recentStudies.map(c => (
                <div className="recent-card" key={c.id}>
                  <div className="recent-cover" style={{ background: `linear-gradient(135deg, ${c.coverColor}, ${c.coverColor}99)` }}>
                    <span className="recent-progress-badge">{c.progress}%</span>
                  </div>
                  <div className="recent-body">
                    <h4>{c.title}</h4>
                    <p className="recent-chapter">{c.chapterName}</p>
                    <div className="recent-bar">
                      <div className="recent-fill" style={{ width: `${c.progress}%`, background: c.coverColor }} />
                    </div>
                    <span className="recent-time">{c.lastTime}学习</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Recommended Courses ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>推荐课程</h2>
            <span className="section-link" onClick={() => navigate('/courses')}>全部课程 →</span>
          </div>
          <div className="courses-grid">
            {recommendCourses.map(c => (
              <div className="web-course-card" key={c.id}>
                <div className="wcc-cover" style={c._coverUrl
                  ? { backgroundImage: `url(${c._coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: `linear-gradient(135deg, ${c.coverColor}, ${c.coverColor}88)` }}>
                  {!c._coverUrl && <span className="wcc-emoji">📖</span>}
                </div>
                <div className="wcc-body">
                  <div className="wcc-tags">
                    {c.tags.map(t => <span key={t} className="wcc-tag">{t}</span>)}
                  </div>
                  <h3>{c.title}</h3>
                  <div className="wcc-meta">
                    <span>⭐ {c.rating}</span>
                    <span>{c.lessonCount} 节课</span>
                    <span>{c.learnerCount.toLocaleString()} 人学习</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>准备好开始你的智能学习之旅了吗？</h2>
            <p>注册即可免费体验全部 AI 功能</p>
          </div>
          <button className="btn-primary btn-lg" onClick={() => navigate('/ai-chat')}>
            立即开始
          </button>
        </div>
      </section>
    </div>
  )
}
