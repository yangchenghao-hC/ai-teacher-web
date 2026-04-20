import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { courseList as mockCourses, GRADE_LEVELS, SORT_OPTIONS } from '../data/mock-data'
import { db, login } from '../cloudbase'
import { COURSE_CATALOG, STAGES, SUBJECTS } from '../utils/admin-api'
import { loadCoverUrls } from '../utils/upload'
import './Courses.css'

export default function Courses() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState('all')
  const [stage, setStage] = useState('全部')
  const [subject, setSubject] = useState('全部')
  const [subcat, setSubcat] = useState('全部')
  const [search, setSearch] = useState('')
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        await login()
        const res = await db.collection('courses').limit(100).get()
        if (res.data && res.data.length > 0) {
          const withCovers = await loadCoverUrls(res.data)
          setCourseList(withCovers.map(c => ({ ...c, id: c._id })))
        } else {
          setCourseList(mockCourses)
        }
      } catch (e) {
        console.warn('courses 云端加载失败，使用本地数据', e)
        setCourseList(mockCourses)
      }
      setLoading(false)
    })()
  }, [])

  /* 当前目录配置 */
  const currentCatalog = COURSE_CATALOG.find(c => c.key === catalog)

  const filtered = courseList.filter(c => {
    if (catalog !== 'all' && c.catalog && c.catalog !== catalog) return false
    if (catalog === 'resource') {
      if (stage !== '全部' && c.category !== stage) return false
      if (subject !== '全部' && c.subject !== subject) return false
    }
    if ((catalog === 'skill' || catalog === 'exam') && subcat !== '全部') {
      if (c.category !== subcat) return false
    }
    if (search && !c.title.includes(search)) return false
    return true
  })

  /* 切换目录时重置子筛选 */
  function switchCatalog(key) {
    setCatalog(key)
    setStage('全部')
    setSubject('全部')
    setSubcat('全部')
  }

  return (
    <div className="courses-page">
      <div className="container">
        {/* 目录 Tab 栏 */}
        <div className="catalog-tabs">
          <button className={`catalog-tab${catalog === 'all' ? ' active' : ''}`} onClick={() => switchCatalog('all')}>
            <span className="catalog-icon">📋</span>全部课程
          </button>
          {COURSE_CATALOG.map(cat => (
            <button key={cat.key} className={`catalog-tab${catalog === cat.key ? ' active' : ''}`} onClick={() => switchCatalog(cat.key)}>
              <span className="catalog-icon">{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>

        <div className="courses-layout">
          {/* Sidebar */}
          <aside className="courses-sidebar">
            <div className="sidebar-section">
              <h3>搜索课程</h3>
              <input className="sidebar-search" placeholder="输入关键词..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* 资源库：学段 + 学科 */}
            {(catalog === 'all' || catalog === 'resource') && (
              <div className="sidebar-section">
                <h3>学段筛选</h3>
                <div className="filter-list">
                  {['全部', ...STAGES].map(g => (
                    <label key={g} className={`filter-item ${stage === g ? 'active' : ''}`}>
                      <input type="radio" name="stage" checked={stage === g} onChange={() => setStage(g)} />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {catalog === 'resource' && (
              <div className="sidebar-section">
                <h3>学科筛选</h3>
                <div className="filter-list">
                  {['全部', ...SUBJECTS.slice(0, 12)].map(s => (
                    <label key={s} className={`filter-item ${subject === s ? 'active' : ''}`}>
                      <input type="radio" name="subject" checked={subject === s} onChange={() => setSubject(s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 技能/考试专区：子分类 */}
            {(catalog === 'skill' || catalog === 'exam') && currentCatalog && (
              <div className="sidebar-section">
                <h3>子分类</h3>
                <div className="filter-list">
                  {['全部', ...currentCatalog.subcategories].map(s => (
                    <label key={s} className={`filter-item ${subcat === s ? 'active' : ''}`}>
                      <input type="radio" name="subcat" checked={subcat === s} onChange={() => setSubcat(s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {catalog === 'all' && (
              <div className="sidebar-section">
                <h3>排序方式</h3>
                <div className="filter-list">
                  {SORT_OPTIONS.map(s => (
                    <label key={s.key} className={`filter-item`}>
                      <input type="radio" name="sort" />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main grid */}
          <div className="courses-main">
            <div className="courses-topbar">
              <h1>{currentCatalog ? currentCatalog.name : '课程中心'}</h1>
              <span className="courses-count">{filtered.length} 门课程</span>
            </div>

            {/* Mobile filter pills */}
            <div className="mobile-filters">
              {['全部', ...STAGES].map(g => (
                <button key={g} className={`mpill ${stage === g ? 'active' : ''}`} onClick={() => setStage(g)}>{g}</button>
              ))}
            </div>

            {loading ? (
              <div className="empty-state"><p>加载中…</p></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state"><p>暂无匹配的课程</p></div>
            ) : (
              <div className="courses-grid">
                {filtered.map(c => (
                  <div className="c-card" key={c.id || c._id} onClick={() => navigate(`/courses/${c.id || c._id}`)}>
                    <div className="c-cover" style={c._coverUrl
                      ? { backgroundImage: `url(${c._coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: `linear-gradient(135deg, ${c.coverColor || '#4F7CFF'}, ${c.coverColor || '#4F7CFF'}88)` }}>
                      {!c._coverUrl && <span>📖</span>}
                    </div>
                    <div className="c-body">
                      <div className="c-tags">
                        {(c.tags || []).map(t => <span key={t} className="c-tag">{t}</span>)}
                        {c.catalog && !c.tags?.length && (
                          <>
                            {c.category && <span className="c-tag">{c.category}</span>}
                            {c.subject && <span className="c-tag">{c.subject}</span>}
                          </>
                        )}
                      </div>
                      <h3>{c.title}</h3>
                      <div className="c-meta">
                        {c.rating > 0 && <span>⭐ {c.rating}</span>}
                        {c.lessonCount > 0 && <span>{c.lessonCount} 节</span>}
                        {c.learnerCount > 0 && <span>{(c.learnerCount || 0).toLocaleString()} 人</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
