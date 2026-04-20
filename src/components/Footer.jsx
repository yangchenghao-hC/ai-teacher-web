import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo">🎓 TKBS师范生成长平台</div>
          <p>AI 赋能教师教育，让学习更智能、更高效。</p>
        </div>

        <div className="footer-col">
          <h4>平台</h4>
          <Link to="/courses">课程中心</Link>
          <Link to="/openmaic">AI互动课堂</Link>
          <Link to="/ai-chat">AI助手</Link>
        </div>

        <div className="footer-col">
          <h4>发现</h4>
          <Link to="/news">校园资讯</Link>
          <Link to="/activities">活动报名</Link>
          <Link to="/profile">个人中心</Link>
        </div>

        <div className="footer-col">
          <h4>关于</h4>
          <a href="#!">使用条款</a>
          <a href="#!">隐私政策</a>
          <a href="#!">联系我们</a>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© 2026 </span>
        <span>Powered byTKBS&amp;AI</span>
      </div>
    </footer>
  )
}
