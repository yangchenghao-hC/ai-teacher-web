import { useState, useRef, useEffect } from 'react'
import { aiScenes } from '../data/mock-data'
import { simpleChat } from '../services/maic-service'
import './AIChat.css'

export default function AIChat() {
  const [scene, setScene] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function selectScene(s) {
    setScene(s)
    setMessages([{ role: 'assistant', content: `你好！我是你的 AI ${s.name}助手，有什么可以帮你的？` }])
  }

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Build message history for AI
      const chatMessages = newMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
      const res = await simpleChat(chatMessages, scene?.name)
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply || '暂时无法回答，请稍后再试。' }])
    } catch (err) {
      console.error('AI 回复失败:', err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，AI 服务暂时不可用，请稍后重试。'
      }])
    }
    setLoading(false)
  }

  /* ---- Scene selection (no active chat) ---- */
  if (!scene) {
    return (
      <div className="chat-page chat-select">
        <div className="chat-select-inner">
          <div className="chat-select-header">
            <span className="chat-header-icon">💬</span>
            <h1>AI 智能助手</h1>
            <p>选择一个对话场景，获得针对性的 AI 辅助</p>
          </div>
          <div className="scene-grid">
            {aiScenes.map(s => (
              <div className="scene-card" key={s.id} onClick={() => selectScene(s)}>
                <span className="scene-icon">{s.icon}</span>
                <div className="scene-text">
                  <h4>{s.name}</h4>
                  <p>{s.desc}</p>
                </div>
                <span className="scene-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ---- Active chat with sidebar ---- */
  return (
    <div className="chat-page chat-active">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-head">
          <h3>对话场景</h3>
        </div>
        <ul className="sidebar-scenes">
          {aiScenes.map(s => (
            <li
              key={s.id}
              className={`sidebar-item${scene.id === s.id ? ' active' : ''}`}
              onClick={() => selectScene(s)}
            >
              <span className="sidebar-icon">{s.icon}</span>
              <span className="sidebar-name">{s.name}</span>
            </li>
          ))}
        </ul>
        <button className="sidebar-back" onClick={() => setScene(null)}>← 返回场景选择</button>
      </aside>

      {/* Main chat area */}
      <div className="chat-main">
        <header className="chat-topbar">
          <div className="topbar-left">
            <button className="mobile-back" onClick={() => setScene(null)}>←</button>
            <span className="topbar-icon">{scene.icon}</span>
            <h3>{scene.name}</h3>
          </div>
          <span className="topbar-badge">AI 对话</span>
        </header>

        <div className="message-list" ref={listRef}>
          <div className="msg-container">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === 'assistant' && <div className="avatar">🤖</div>}
                <div className="bubble">{m.content}</div>
                {m.role === 'user' && <div className="avatar user-avatar">👤</div>}
              </div>
            ))}
            {loading && (
              <div className="msg assistant">
                <div className="avatar">🤖</div>
                <div className="bubble typing">
                  <span className="dot-anim" />
                  <span className="dot-anim" />
                  <span className="dot-anim" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="input-bar">
          <div className="input-wrap">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="输入你的问题..."
              className="chat-input"
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
              发送
            </button>
          </div>
          <p className="input-hint">AI 助手基于大语言模型，回答仅供参考</p>
        </div>
      </div>
    </div>
  )
}
