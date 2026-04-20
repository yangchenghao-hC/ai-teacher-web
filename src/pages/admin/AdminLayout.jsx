import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAdminAuth, clearAdminAuth } from '../../utils/auth'
import '/src/styles/admin.css'

const NAV_ITEMS = [
  { to: '/admin', icon: '📊', label: '概览', exact: true },
]

const CONTENT_ITEMS = [
  { to: '/admin/banners', icon: '🖼️', label: 'Banner 管理' },
  { to: '/admin/courses', icon: '📚', label: '课程管理' },
  { to: '/admin/news', icon: '📰', label: '资讯管理' },
  { to: '/admin/events', icon: '🎯', label: '活动管理' },
]

const SYSTEM_ITEMS = [
  { to: '/admin/accounts', icon: '👤', label: '账号管理' },
]

const PAGE_TITLES = {
  '/admin': '管理概览',
  '/admin/banners': 'Banner 管理',
  '/admin/courses': '课程管理',
  '/admin/news': '资讯管理',
  '/admin/events': '活动管理',
  '/admin/accounts': '账号管理',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const title = PAGE_TITLES[pathname] || '管理后台'
  const [auth, setAuth] = useState(() => getAdminAuth())

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  function handleLogout() {
    clearAdminAuth()
    navigate('/admin/login', { replace: true })
  }

  if (!auth) return null

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="brand-icon">⚙️</div>
          <div>
            <div className="brand-text">TKBS师范生成长平台</div>
            <span className="brand-tag">管理后台</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="admin-nav-section">内容管理</div>
          {CONTENT_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="admin-nav-section">系统设置</div>
          {SYSTEM_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="#/">← 返回前台</a>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="admin-main">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <div className="admin-topbar-right">
            <span>{auth.displayName || auth.username}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: 8, fontSize: 12 }}>退出登录</button>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
