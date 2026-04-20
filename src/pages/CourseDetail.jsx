import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseList } from '../data/mock-data'
import { db, login } from '../cloudbase'
import { getFileUrl } from '../utils/upload'
import './CourseDetail.css'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedCh, setExpandedCh] = useState({})
  const [coverUrl, setCoverUrl] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const res = await db.collection('courses').doc(id).get()
        if (res.data) {
          setCourse(res.data)
          if (res.data.coverImage) {
            getFileUrl(res.data.coverImage).then(u => setCoverUrl(u)).catch(() => {})
          }
          setLoading(false)
          return
        }
      } catch (e) { /* fallback to mock */ }
      const mock = courseList.find(c => c.id === id)
      setCourse(mock || null)
      setLoading(false)
    })()
  }, [id])

  // default expand first chapter
  useEffect(() => {
    if (course?.chapters?.length) { setExpandedCh({ 0: true }) }
  }, [course])

  function toggleCh(i) { setExpandedCh(prev => ({ ...prev, [i]: !prev[i] })) }

  if (loading) return <div className="cd-page" style={{ padding: 80, textAlign: 'center' }}>加载中…</div>
  if (!course) return <div className="cd-page" style={{ padding: 80, textAlign: 'center' }}>课程不存在</div>

  const color = course.coverColor || '#4F7CFF'
  const tags = course.tags || []
  const chapters = course.chapters || []
  const catalogLabel = course.catalog === 'resource' ? '师范生教育资源库'
    : course.catalog === 'skill' ? '师范生教学技能专区'
    : course.catalog === 'exam' ? '考试与备考专区' : ''

  return (
    <div className="cd-page">
      {/* Banner */}
      <div className="cd-banner" style={coverUrl
        ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: `linear-gradient(135deg, ${color}, ${color}99)` }
      }>
        <div className="cd-banner-content container">
          <button className="cd-back" onClick={() => navigate(-1)}>← 返回课程列表</button>
          <div className="cd-banner-tags">
            {catalogLabel && <span className="cd-catalog-tag">{catalogLabel}</span>}
            {course.category && <span className="cd-cat-tag">{course.category}</span>}
            {course.subject && <span className="cd-cat-tag">{course.subject}</span>}
            {tags.map(t => <span key={t} className="cd-cat-tag">{t}</span>)}
          </div>
          <h1>{course.title}</h1>
          <div className="cd-banner-meta">
            {course.rating > 0 && <span>⭐ {course.rating} 评分</span>}
            {course.lessonCount > 0 && <span>📚 {course.lessonCount} 节课</span>}
            {course.learnerCount > 0 && <span>👥 {(course.learnerCount || 0).toLocaleString()} 人学习</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="cd-body container">
        <div className="cd-main">
          {/* 课程简介 */}
          <section className="cd-section">
            <h2>课程简介</h2>
            <p className="cd-desc">
              {course.description || `本课程属于${catalogLabel || '师范生'}${course.subject ? '「' + course.subject + '」' : ''}方向，共 ${course.lessonCount || 0} 节课。通过本课程的学习，你将系统掌握核心知识与教学技能。`}
            </p>
          </section>

          {/* 课程大纲 */}
          <section className="cd-section">
            <h2>课程大纲</h2>
            {chapters.length > 0 ? (
              <div className="cd-outline">
                {chapters.map((ch, ci) => (
                  <div className="cd-chapter" key={ci}>
                    <div className="cd-chapter-header" onClick={() => toggleCh(ci)}>
                      <span className="cd-chapter-arrow">{expandedCh[ci] ? '▾' : '▸'}</span>
                      <span className="cd-chapter-num">第 {ci + 1} 章</span>
                      <span className="cd-chapter-title">{ch.title || '未命名章节'}</span>
                      <span className="cd-chapter-count">{ch.lessons?.length || 0} 课时</span>
                    </div>
                    {expandedCh[ci] && ch.lessons?.length > 0 && (
                      <div className="cd-lessons">
                        {ch.lessons.map((ls, li) => (
                          <div className="cd-lesson-item" key={li}>
                            <span className="cd-lesson-num">{ci + 1}.{li + 1}</span>
                            <span className="cd-lesson-title">{ls.title || '未命名课时'}</span>
                            {ls.duration > 0 && <span className="cd-lesson-dur">{ls.duration} 分钟</span>}
                            {ls.videoUrl ? (
                              <a className="cd-lesson-play" href={ls.videoUrl} target="_blank" rel="noreferrer">▶ 播放</a>
                            ) : (
                              <span className="cd-lesson-badge">视频</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="cd-outline">
                {Array.from({ length: Math.min(course.lessonCount || 5, 8) }, (_, i) => (
                  <div className="cd-outline-item" key={i}>
                    <span className="cd-outline-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cd-outline-title">第 {i + 1} 节</span>
                    <span className="cd-outline-badge">视频</span>
                  </div>
                ))}
                {(course.lessonCount || 0) > 8 && (
                  <div className="cd-outline-more">还有 {course.lessonCount - 8} 节内容…</div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="cd-sidebar">
          <div className="cd-info-card">
            <div className="cd-info-cover" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
              <span>📖</span>
            </div>
            <h3>{course.title}</h3>
            {course.teacher && <p className="cd-teacher">👨‍🏫 {course.teacher}</p>}
            <div className="cd-info-stats">
              {course.rating > 0 && <div className="cd-stat"><strong>{course.rating}</strong><span>评分</span></div>}
              {course.lessonCount > 0 && <div className="cd-stat"><strong>{course.lessonCount}</strong><span>节课</span></div>}
              {course.learnerCount > 0 && <div className="cd-stat"><strong>{(course.learnerCount || 0).toLocaleString()}</strong><span>学习</span></div>}
            </div>
            <button className="cd-enroll-btn" style={{ background: color }}>开始学习</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
