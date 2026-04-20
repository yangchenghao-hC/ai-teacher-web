import { useNavigate } from 'react-router-dom'
import { userInfo } from '../data/mock-data'
import './Profile.css'

const menuGroups = [
  {
    title: '学习',
    items: [
      { icon: '📚', label: '我的课程', count: userInfo.completedCourses },
      { icon: '⭐', label: '我的收藏', count: 8 },
      { icon: '⏱️', label: '学习记录' },
      { icon: '📅', label: '学习日历' }
    ]
  },
  {
    title: '服务',
    items: [
      { icon: '📰', label: '校园资讯', path: '/news' },
      { icon: '🎯', label: '活动报名', path: '/activities' },
      { icon: '💬', label: 'AI 对话记录', count: userInfo.aiChatCount }
    ]
  },
  {
    title: '设置',
    items: [
      { icon: '🔔', label: '消息通知' },
      { icon: '⚙️', label: '设置' },
      { icon: '❓', label: '帮助与反馈' }
    ]
  }
]

const quickActions = [
  { icon: '📊', label: '学习报告', desc: '查看个人学习数据分析' },
  { icon: '🎓', label: '证书中心', desc: '管理已获得的课程证书' },
  { icon: '🤝', label: '学习小组', desc: '加入或创建学习小组' },
  { icon: '🏆', label: '成就徽章', desc: '查看学习成就与里程碑' },
]

export default function Profile() {
  const navigate = useNavigate()
  const hours = Math.floor(userInfo.totalStudyMinutes / 60)
  const mins = userInfo.totalStudyMinutes % 60

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="profile-banner">
        <div className="banner-bg" />
        <div className="banner-content container">
          <div className="user-avatar-lg">{userInfo.nickName[0]}</div>
          <div className="user-meta">
            <h1>{userInfo.nickName}</h1>
            <p>{userInfo.school} · {userInfo.major} · {userInfo.grade}</p>
          </div>
          <div className="banner-stats">
            <div className="b-stat">
              <span className="b-stat-num">{hours}h{mins}m</span>
              <span className="b-stat-label">总学习时长</span>
            </div>
            <div className="b-stat">
              <span className="b-stat-num">{userInfo.completedCourses}</span>
              <span className="b-stat-label">已完成课程</span>
            </div>
            <div className="b-stat">
              <span className="b-stat-num">{userInfo.certificates}</span>
              <span className="b-stat-label">获得证书</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="profile-body container">
        {/* Left: menu groups */}
        <div className="profile-left">
          {menuGroups.map(g => (
            <div className="menu-group" key={g.title}>
              <h3 className="menu-group-title">{g.title}</h3>
              {g.items.map(item => (
                <div
                  className="menu-item"
                  key={item.label}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  {item.count != null && <span className="menu-badge">{item.count}</span>}
                  <span className="menu-arrow">›</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: quick actions */}
        <div className="profile-right">
          <h3 className="section-title">快捷操作</h3>
          <div className="quick-grid">
            {quickActions.map(a => (
              <div className="quick-card" key={a.label}>
                <span className="quick-icon">{a.icon}</span>
                <h4>{a.label}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
