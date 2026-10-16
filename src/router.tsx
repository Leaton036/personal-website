import { Link, Route, Routes } from 'react-router-dom'
import { FrontLayout } from '@/components/layout/FrontLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { RequireAuth } from '@/components/RequireAuth'

import Home from '@/pages/Home'
import About from '@/pages/About'
import Skills from '@/pages/Skills'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Blog from '@/pages/Blog'
import BlogDetail from '@/pages/BlogDetail'
import Contact from '@/pages/Contact'

import Login from '@/admin/Login'
import Dashboard from '@/admin/Dashboard'
import AdminProfile from '@/admin/Profile'
import AdminSkills from '@/admin/Skills'
import AdminProjects from '@/admin/Projects'
import AdminPosts from '@/admin/Posts'
import AdminSettings from '@/admin/Settings'

/** 404 兜底页 */
function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-text">404</h1>
        <p className="mt-3 text-muted">页面不存在</p>
        <Link to="/" className="mt-5 inline-block text-accent hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  )
}

/** 应用路由：前台与后台隔离 */
export function AppRoutes() {
  return (
    <Routes>
      {/* 前台 */}
      <Route element={<FrontLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* 后台登录（无需鉴权） */}
      <Route path="admin/login" element={<Login />} />

      {/* 后台（需登录） */}
      <Route path="admin" element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* 兜底 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
