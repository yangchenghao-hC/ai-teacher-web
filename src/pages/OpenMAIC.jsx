import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateFullClassroom, listRooms, deleteRoom } from '../services/maic-service'
import './OpenMAIC.css'

const recommendTopics = [
  '小学数学课堂导入设计',
  '班主任主题班会策划',
  '幼儿园游戏化教学',
  '高中生涯规划指导',
  '信息技术学科融合'
]

const recommendClassrooms = [
  { id: 'demo-1', title: '教育心理学角色扮演', emoji: '🧠', agentCount: 4, desc: '多角色模拟认知发展案例，深入理解皮亚杰、维果茨基等理论', color: '#4F7CFF' },
  { id: 'demo-2', title: '课堂教学微格训练', emoji: '🎓', agentCount: 3, desc: 'AI 学生智能体互动练习，模拟真实课堂情境进行教学训练', color: '#7B68EE' },
  { id: 'demo-3', title: '教育辩论场', emoji: '⚡', agentCount: 5, desc: '围绕教育热点话题展开辩论，培养批判性思维和论证能力', color: '#FF6B6B' }
]

export default function OpenMAIC() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(null)
  const [myClassrooms, setMyClassrooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Particle animation
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    if (!generating) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let particles = []
    const COUNT = 80
    const DIST = 140
    const COLORS = ['108,142,255', '167,139,250', '99,102,241']

    function resize() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    function init() {
      particles = []
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1,
          color: COLORS[i % COLORS.length],
          alpha: Math.random() * 0.5 + 0.15
        })
      }
    }
    function draw() {
      const w = canvas.offsetWidth, h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(108,142,255,${0.12 * (1 - d / DIST)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    resize(); init(); draw()
    const onResize = () => { resize(); init() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize) }
  }, [generating])

  useEffect(() => { fetchMyClassrooms() }, [])

  async function fetchMyClassrooms() {
    try {
      setLoadingRooms(true)
      const res = await listRooms(10)
      setMyClassrooms(res.list || [])
    } catch (err) {
      console.warn('获取课堂列表失败:', err)
    } finally {
      setLoadingRooms(false)
    }
  }

  async function handleCreate() {
    if (!topic.trim() || generating) return
    setGenerating(true)
    setProgress({ stage: 'creating', percent: 0 })
    try {
      const result = await generateFullClassroom(topic.trim(), {}, p => setProgress(prev => ({ ...prev, ...p })))
      navigate(`/classroom/${result.id}`)
    } catch (err) {
      console.error('生成课堂失败:', err)
      setErrorMsg(err.message || '生成课堂失败，请稍后重试')
    } finally {
      setGenerating(false)
      setProgress(null)
    }
  }

  async function handleDelete(e, id) {
    e.stopPropagation()
    if (!window.confirm('确定删除这个课堂吗？')) return
    try {
      await deleteRoom(id)
      setMyClassrooms(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  const progressText = (() => {
    if (!progress) return ''
    const map = {
      creating: '正在创建课堂...',
      scenes: '正在生成课堂大纲...',
      agents: '正在召唤历史名人...',
      saving: '正在保存...',
      done: '生成完成！即将进入课堂...'
    }
    if (progress.stage === 'content') return `正在生成第 ${(progress.sceneIndex || 0) + 1}/${progress.total || 0} 个场景...`
    if (progress.stage === 'illustrations') return '正在生成配图...'
    return map[progress.stage] || '处理中...'
  })()

  const stageOrder = ['creating', 'scenes', 'agents', 'content', 'illustrations', 'saving', 'done']
  const stageIndex = progress ? stageOrder.indexOf(progress.stage) : -1

  return (
    <div className="maic-page">
      {/* Error banner */}
      {errorMsg && (
        <div className="maic-error-banner" onClick={() => setErrorMsg('')}>
          <span>⚠️ {errorMsg}</span>
          <button className="maic-error-close">✕</button>
        </div>
      )}

      {/* Full-page generation flow */}
      {generating && (
        <div className="gen-fullpage">
          <canvas ref={canvasRef} className="gen-particles-canvas" />

          {/* Stage steps */}
          <div className="gen-steps">
            {[
              { key: 'creating', icon: '🏗️', label: '创建课堂' },
              { key: 'scenes', icon: '📋', label: '生成大纲' },
              { key: 'agents', icon: '🎭', label: '召唤名人' },
              { key: 'content', icon: '✍️', label: '编写内容' },
              { key: 'illustrations', icon: '🎨', label: '生成配图' },
              { key: 'saving', icon: '💾', label: '保存' },
              { key: 'done', icon: '✅', label: '完成' },
            ].map((s, i) => {
              let state = 'pending'
              if (i < stageIndex) state = 'done'
              else if (i === stageIndex) state = 'active'
              return (
                <div key={s.key} className={`gen-step gen-step-${state}`}>
                  <span className="gen-step-icon">{s.icon}</span>
                  <span className="gen-step-label">{s.label}</span>
                  {state === 'done' && <span className="gen-step-check">✓</span>}
                </div>
              )
            })}
          </div>

          {/* Center stage content */}
          <div className="gen-center">
            <div className="gen-pulse-ring" />
            <h2 className="gen-stage-text">{progressText}</h2>

            {/* Scenes preview */}
            {progress?.scenes?.length > 0 && stageIndex >= 1 && (
              <div className="gen-scene-preview">
                {progress.scenes.map((s, i) => (
                  <div key={i} className={`gen-scene-chip${progress.stage === 'content' && progress.sceneIndex === i ? ' gen-scene-active' : ''}${progress.stage === 'content' && i < (progress.sceneIndex || 0) ? ' gen-scene-done' : ''}`}>
                    <span>{s.type === 'slide' ? '📖' : s.type === 'quiz' ? '❓' : '💬'}</span>
                    <span>{s.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom progress */}
          <div className="gen-bottom">
            <div className="gen-bar">
              <div className="gen-bar-fill" style={{ width: `${progress?.percent || 0}%` }} />
            </div>
            <span className="gen-pct">{progress?.percent || 0}%</span>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="maic-hero">
        <div className="maic-hero-bg" />
        <div className="container maic-hero-content">
          <span className="maic-badge">🤖 多智能体协作</span>
          <h1>AI 互动课堂</h1>
          <p>输入讨论主题，AI 自动生成多个角色智能体<br />为你打造沉浸式学习体验</p>
          <div className="maic-input-wrap">
            <input
              className="maic-input"
              placeholder='输入讨论主题，如"小学语文阅读教学策略"'
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              disabled={generating}
            />
            <button className="maic-create-btn" disabled={!topic.trim() || generating} onClick={handleCreate}>
              {generating ? '生成中...' : '创建课堂'}
            </button>
          </div>
          <div className="maic-chips">
            <span className="chips-label">热门推荐:</span>
            {recommendTopics.map(t => (
              <button key={t} className="maic-chip" onClick={() => setTopic(t)}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* My Classrooms */}
      {(myClassrooms.length > 0 || loadingRooms) && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>我的课堂</h2>
            </div>
            {loadingRooms ? (
              <p className="loading-hint">加载中...</p>
            ) : (
              <div className="my-classroom-grid">
                {myClassrooms.map(c => (
                  <div className="my-cr-card" key={c._id} onClick={() => navigate(`/classroom/${c._id}`)}>
                    <div className="my-cr-top">
                      <span className="my-cr-emoji">📚</span>
                      <span className={`my-cr-status ${c.status}`}>
                        {c.status === 'ready' ? '已就绪' : c.status === 'generating' ? '生成中' : c.status}
                      </span>
                    </div>
                    <h3>{c.topic}</h3>
                    <div className="my-cr-meta">
                      <span>{c.scenes?.length || 0} 个场景</span>
                      <span>·</span>
                      <span>{c.createTime ? new Date(c.createTime).toLocaleDateString() : ''}</span>
                    </div>
                    <button className="my-cr-delete" onClick={e => handleDelete(e, c._id)} title="删除">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recommended Classrooms */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>推荐课堂</h2>
          </div>
          <div className="classroom-grid">
            {recommendClassrooms.map(c => (
              <div className="cr-card" key={c.id} onClick={() => { setTopic(c.title); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                <div className="cr-header" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                  <span className="cr-emoji">{c.emoji}</span>
                  <span className="cr-agents">{c.agentCount} 个 AI 智能体</span>
                </div>
                <div className="cr-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <button className="cr-enter" style={{ color: c.color }}>
                    创建此课堂 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
