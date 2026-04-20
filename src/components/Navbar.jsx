import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userInfo } from '../data/mock-data'
import './Navbar.css'

const links = [
  { path: '/', label: '首页' },
  { path: '/courses', label: '课程中心' },
  { path: '/openmaic', label: 'AI 互动课堂' },
  { path: '/ai-chat', label: 'AI 助手' },
  { path: '/news', label: '校园资讯' },
  { path: '/activities', label: '活动报名' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <NavLink to="/" className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">师学通</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {links.map(l => (
            <NavLink
              key={l.path}
              to={l.path}
              end={l.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="nav-user" onClick={() => navigate('/profile')}>
          <div className="nav-avatar">{userInfo.nickName[0]}</div>
          <span className="nav-username">{userInfo.nickName}</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <NavLink
              key={l.path}
              to={l.path}
              end={l.path === '/'}
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mobile-divider" />
          <NavLink to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>
            个人中心
          </NavLink>
        </div>
      )}
    </header>
  )
}
