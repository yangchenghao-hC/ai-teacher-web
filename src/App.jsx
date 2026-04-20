import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ensureSeedData } from './utils/auto-seed'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Courses from './pages/Courses'
import OpenMAIC from './pages/OpenMAIC'
import AIChat from './pages/AIChat'
import Profile from './pages/Profile'
import CampusNews from './pages/CampusNews'
import NewsDetail from './pages/NewsDetail'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import ClassroomPlayer from './pages/ClassroomPlayer'
import CourseDetail from './pages/CourseDetail'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import BannerManage from './pages/admin/BannerManage'
import CourseManage from './pages/admin/CourseManage'
import NewsManage from './pages/admin/NewsManage'
import EventManage from './pages/admin/EventManage'
import AccountManage from './pages/admin/AccountManage'
import './styles/global.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const noFooter = pathname.startsWith('/ai-chat') || pathname.startsWith('/classroom/')
  const isImmersive = pathname.startsWith('/classroom/')

  return (
    <>
      {!isImmersive && <Navbar />}
      <main style={{ flex: 1, paddingTop: isImmersive ? 0 : 'var(--nav-h)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/openmaic" element={<OpenMAIC />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/news" element={<CampusNews />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/classroom/:id" element={<ClassroomPlayer />} />
        </Routes>
      </main>
      {!noFooter && <Footer />}
    </>
  )
}

export default function App() {
  useEffect(() => { ensureSeedData() }, [])
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="banners" element={<BannerManage />} />
          <Route path="courses" element={<CourseManage />} />
          <Route path="news" element={<NewsManage />} />
          <Route path="events" element={<EventManage />} />
          <Route path="accounts" element={<AccountManage />} />
        </Route>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </HashRouter>
  )
}
