import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../utils/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) { setError('请输入用户名和密码'); return }
    setLoading(true)
    try {
      await adminLogin(username.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || '登录失败')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f6fa 0%, #e8ecf4 100%)'
    }}>
      <div style={{
        width: 380, background: '#fff', borderRadius: 16, padding: '48px 36px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚙️</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#1a1a2e' }}>TKBS 管理后台</h1>
          <p style={{ color: '#999', fontSize: 13, margin: '6px 0 0' }}>请使用管理员账号登录</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#555' }}>用户名</label>
            <input
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8,
                fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border-color .2s'
              }}
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="admin" autoFocus
              onFocus={e => e.target.style.borderColor = '#4F7CFF'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#555' }}>密码</label>
            <input
              type="password"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8,
                fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border-color .2s'
              }}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              onFocus={e => e.target.style.borderColor = '#4F7CFF'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {error && (
            <div style={{
              color: '#e74c3c', fontSize: 13, marginBottom: 14, textAlign: 'center',
              background: '#fef2f2', padding: '8px 12px', borderRadius: 6
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '11px 0', background: '#4F7CFF', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              transition: 'opacity .2s'
            }}>
            {loading ? '登录中…' : '登 录'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: '#ccc' }}>
          开发模式 · 默认账号 admin / admin123
        </p>
      </div>
    </div>
  )
}
