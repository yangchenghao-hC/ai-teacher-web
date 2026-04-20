import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { getRoom, getNextSpeaker, getAgentReply, DEFAULT_AGENTS } from '../services/maic-service'
import './ClassroomPlayer.css'

/* ========== Agent Avatar: render img if avatarUrl exists, else emoji ========== */
function AgentAvatar({ agent, className }) {
  if (agent?.avatarUrl) {
    return <img className={`agent-avatar-img ${className || ''}`} src={agent.avatarUrl} alt={agent.name} />
  }
  return <span className={className}>{agent?.avatar || '🤖'}</span>
}

/* ========== Slide Renderer ========== */
function SlideRenderer({ scene, index, total }) {
  const [illustError, setIllustError] = useState(false)
  useEffect(() => { setIllustError(false) }, [scene?.illustrationUrl])

  const html = scene.contentHtml
    ? DOMPurify.sanitize(scene.contentHtml, {
        ALLOWED_TAGS: ['ul','ol','li','p','strong','em','blockquote','h4','h5','table','thead','tbody','tr','th','td','br','span','code','pre','hr','sup','sub'],
        ALLOWED_ATTR: ['class','style']
      })
    : null

  const layout = scene.layout || 'content'
  const hasIllustration = !!scene.illustrationUrl && !illustError

  return (
    <div className="slide-scale-wrap">
      <div className={`slide-card slide-layout-${layout}`}>
        <div className="slide-number">{String(index + 1).padStart(2, '0')}</div>
        <div className="slide-header">
          <h2 className="slide-title">{scene.title}</h2>
          {scene.subtitle && <p className="slide-subtitle">{scene.subtitle}</p>}
        </div>
        <div className={`slide-body${hasIllustration ? ' slide-body-with-illustration' : ''}`}>
          {hasIllustration && (
            <img className="slide-illustration" src={scene.illustrationUrl} alt={scene.title} loading="lazy" onError={() => setIllustError(true)} />
          )}
          {html ? (
            <div className="slide-html" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="slide-text">
              {scene.narration && <p>{scene.narration}</p>}
              {scene.notes?.length > 0 && (
                <ul className="slide-notes-list">
                  {scene.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="slide-footer">
          <span className="slide-topic-tag">📖 知识讲解</span>
          <span className="slide-page">{index + 1} / {total}</span>
        </div>
      </div>
    </div>
  )
}

/* ========== Quiz Renderer ========== */
function QuizRenderer({ scene, index, total }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const correct = scene.correctIndex ?? scene.correct ?? 0

  return (
    <div className="quiz-scale-wrap">
      <div className="quiz-card">
        <div className="slide-number">{String(index + 1).padStart(2, '0')}</div>
        <div className="quiz-header">
        <span className="quiz-badge">❓ 随堂测验</span>
        <h2 className="quiz-question-text">{scene.question || scene.title}</h2>
      </div>
      <div className="quiz-options-grid">
        {(scene.options || []).map((opt, i) => {
          let cls = 'quiz-option-card'
          if (revealed && i === correct) cls += ' correct'
          else if (revealed && selected === i && i !== correct) cls += ' wrong'
          else if (!revealed && selected === i) cls += ' selected'
          return (
            <button key={i} className={cls} onClick={() => { if (!revealed) { setSelected(i); setRevealed(true) } }}>
              <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
              <span className="quiz-option-text">{opt}</span>
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className={`quiz-result ${selected === correct ? 'quiz-correct' : 'quiz-wrong'}`}>
          <span>{selected === correct ? '✅ 回答正确！' : `❌ 正确答案是 ${String.fromCharCode(65 + correct)}`}</span>
          {scene.explanation && <p>{scene.explanation}</p>}
        </div>
      )}
      <div className="slide-footer">
        <span className="slide-topic-tag">❓ 随堂测验</span>
        <span className="slide-page">{index + 1} / {total}</span>
      </div>
      </div>
    </div>
  )
}

/* ========== Main Player ========== */
export default function ClassroomPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [sceneIndex, setSceneIndex] = useState(0)

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('imm-theme') || 'dark')
  function toggleTheme() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('imm-theme', next)
      return next
    })
  }

  // Discussion
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const chatRef = useRef(null)

  // Narration display
  const [showNarration, setShowNarration] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await getRoom(id)
        setClassroom(res.data || res)
      } catch (err) {
        console.error('加载课堂失败:', err)
        setLoadError(err.message || '加载课堂失败')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Reset on scene change
  useEffect(() => {
    setMessages([])
    setInput('')
    setTurnCount(0)
    setShowNarration(true)
  }, [sceneIndex])

  // Auto-start discussion
  const scene = classroom?.scenes?.[sceneIndex]
  const prevSceneRef = useRef(null)
  useEffect(() => {
    if (scene?.type === 'discussion' && scene !== prevSceneRef.current) {
      prevSceneRef.current = scene
      startDiscussion()
    }
  }, [scene])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextScene() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevScene() }
      if (e.key === 'Escape') navigate('/openmaic')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sceneIndex, classroom])

  const agents = classroom?.agents?.length ? classroom.agents : DEFAULT_AGENTS
  const totalScenes = classroom?.scenes?.length || 0

  function prevScene() { setSceneIndex(i => Math.max(0, i - 1)) }
  function nextScene() { setSceneIndex(i => Math.min(totalScenes - 1, i + 1)) }

  async function startDiscussion() {
    const teacher = agents.find(a => a.role === 'teacher') || agents[0]
    setChatLoading(true)
    try {
      const res = await getAgentReply(teacher, [], {
        topic: classroom.topic,
        sceneTitle: scene?.title,
        discussionPrompt: scene?.prompt || scene?.title
      })
      setMessages([{
        role: 'agent', agentId: teacher.id, agent: teacher,
        content: res.content || res.reply || `同学们好！今天我们来讨论"${scene?.title}"。大家有什么想法？`
      }])
      setTurnCount(1)
    } catch {
      setMessages([{
        role: 'agent', agentId: teacher.id, agent: teacher,
        content: `同学们好！今天我们来讨论"${scene?.title}"。大家有什么想法？`
      }])
      setTurnCount(1)
    }
    setChatLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || chatLoading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setChatLoading(true)

    try {
      const summary = newMessages.slice(-6).map(m =>
        m.role === 'user' ? `用户: ${m.content}` : `${m.agent?.name || 'AI'}: ${m.content}`
      ).join('\n')

      const directorRes = await getNextSpeaker(agents, summary, [], turnCount, 20, {
        topic: classroom.topic, sceneTitle: scene?.title
      })

      if (directorRes.shouldEnd) {
        setMessages(prev => [...prev, { role: 'system', content: '本轮讨论结束，可以进入下一个环节。' }])
        setChatLoading(false)
        return
      }

      const nextAgent = agents.find(a => a.id === directorRes.nextAgentId) || agents[0]
      const agentRes = await getAgentReply(
        nextAgent,
        newMessages.slice(-8).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.role === 'user' ? m.content : `[${m.agent?.name || 'AI'}] ${m.content}`
        })),
        { topic: classroom.topic, sceneTitle: scene?.title }
      )

      setMessages(prev => [...prev, {
        role: 'agent', agentId: nextAgent.id, agent: nextAgent,
        content: agentRes.content || agentRes.reply || '让我想想...'
      }])
      setTurnCount(prev => prev + 1)
    } catch (err) {
      console.error('Agent reply error:', err)
      const fallback = agents[turnCount % agents.length]
      setMessages(prev => [...prev, {
        role: 'agent', agentId: fallback.id, agent: fallback,
        content: '抱歉，我需要一点时间来思考这个问题。'
      }])
    }
    setChatLoading(false)
  }

  /* ---- Loading / Error ---- */
  if (loading) return (
    <div className={`imm-status ${theme}`}><div className="imm-spinner" /><p>加载课堂中...</p></div>
  )
  if (loadError) return (
    <div className={`imm-status imm-status--error ${theme}`}>
      <p>⚠️ 加载失败</p>
      <p className="imm-error-detail">{loadError}</p>
      <button className="imm-back-btn" onClick={() => navigate('/openmaic')}>返回 OpenMAIC</button>
    </div>
  )
  if (!classroom?.scenes?.length) return (
    <div className={`imm-status ${theme}`}>
      <p>课堂不存在或内容为空</p>
      <button className="imm-back-btn" onClick={() => navigate('/openmaic')}>返回 OpenMAIC</button>
    </div>
  )

  /* ---- Render ---- */
  return (
    <div className={`imm-player ${theme}`}>
      {/* Top Bar */}
      <header className="imm-topbar">
        <button className="imm-back" onClick={() => navigate('/openmaic')}>
          <span>←</span>
          <span className="imm-back-label">返回</span>
        </button>
        <div className="imm-topbar-center">
          <span className="imm-topic-name">{classroom.topic}</span>
          <h1 className="imm-scene-title">{scene?.title}</h1>
        </div>
        <div className="imm-topbar-right">
          <button className="imm-theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="imm-scene-count">{sceneIndex + 1} / {totalScenes}</span>
        </div>
      </header>

      {/* Main Stage */}
      <div className="imm-stage">
        {scene?.type === 'slide' && (
          <SlideRenderer scene={scene} index={sceneIndex} total={totalScenes} />
        )}

        {scene?.type === 'quiz' && (
          <QuizRenderer scene={scene} index={sceneIndex} total={totalScenes} />
        )}

        {scene?.type === 'discussion' && (
          <div className="disc-scale-wrap">
          <div className="imm-discussion">
            {scene.prompt && (
              <div className="imm-disc-prompt">
                <span className="imm-disc-icon">💬</span>
                <div>
                  <h3>课堂讨论</h3>
                  <p>{scene.prompt}</p>
                </div>
              </div>
            )}
            {scene.questions?.length > 0 && (
              <div className="imm-disc-questions">
                {scene.questions.map((q, i) => <span key={i} className="imm-disc-q">💡 {q}</span>)}
              </div>
            )}
            <div className="imm-disc-chat" ref={chatRef}>
              {messages.map((m, i) => {
                if (m.role === 'system') return <div key={i} className="imm-disc-system">{m.content}</div>
                if (m.role === 'user') return (
                  <div key={i} className="imm-chat-row imm-chat-user">
                    <div className="imm-chat-bubble imm-user-bubble">{m.content}</div>
                    <div className="imm-chat-avatar imm-user-avatar">👤</div>
                  </div>
                )
                return (
                  <div key={i} className="imm-chat-row imm-chat-agent">
                    <div className="imm-chat-avatar" style={{ borderColor: m.agent?.color, background: (m.agent?.color || '#4F7CFF') + '15' }}>
                      <AgentAvatar agent={m.agent} />
                    </div>
                    <div className="imm-chat-body">
                      <span className="imm-chat-name" style={{ color: m.agent?.color }}>{m.agent?.name}</span>
                      <div className="imm-chat-bubble imm-agent-bubble">{m.content}</div>
                    </div>
                  </div>
                )
              })}
              {chatLoading && (
                <div className="imm-chat-row imm-chat-agent">
                  <div className="imm-chat-avatar">🤔</div>
                  <div className="imm-chat-bubble imm-agent-bubble imm-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
            <div className="imm-disc-input">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="输入你的想法..." disabled={chatLoading} />
              <button onClick={sendMessage} disabled={!input.trim() || chatLoading}>发送</button>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Bottom Bar — Agent Narration + Nav */}
      <footer className="imm-bottombar">
        {/* Agent narration for slides */}
        {scene?.type === 'slide' && scene.narration && showNarration && (
          <div className="imm-narration">
            <div className="imm-narr-agent" style={{ borderColor: agents[0]?.color }}>
              <span className="imm-narr-avatar"><AgentAvatar agent={agents[0]} /></span>
              <span className="imm-narr-name" style={{ color: agents[0]?.color }}>{agents[0]?.name || '老师'}</span>
            </div>
            <p className="imm-narr-text">{scene.narration}</p>
            <button className="imm-narr-close" onClick={() => setShowNarration(false)}>✕</button>
          </div>
        )}

        {/* Agent avatars + Controls */}
        <div className="imm-controls">
          <div className="imm-agents-row">
            {agents.map(a => (
              <div key={a.id} className="imm-agent-chip" style={{ '--agent-color': a.color }} title={`${a.name} (${a.role})`}>
                <AgentAvatar agent={a} className="imm-agent-avatar" />
              </div>
            ))}
          </div>

          {/* Scene dots */}
          <div className="imm-scene-dots">
            {classroom.scenes.map((s, i) => (
              <button key={i} className={`imm-dot${i === sceneIndex ? ' active' : ''}${i < sceneIndex ? ' done' : ''}`}
                onClick={() => setSceneIndex(i)}
                title={s.title}
              >
                <span className="imm-dot-inner" />
              </button>
            ))}
          </div>

          {/* Nav buttons */}
          <div className="imm-nav-btns">
            <button className="imm-nav-btn" disabled={sceneIndex === 0} onClick={prevScene}>‹ 上一页</button>
            <button className="imm-nav-btn imm-nav-next" disabled={sceneIndex >= totalScenes - 1} onClick={nextScene}>下一页 ›</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
