import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FileText,
  Folder,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Wrench,
} from 'lucide-react'
import { logout } from '@/api'

const ADMIN_NAV = [
  { to: '/admin', label: '仪表盘', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: '个人信息', icon: User, end: false },
  { to: '/admin/skills', label: '技能', icon: Wrench, end: false },
  { to: '/admin/projects', label: '项目', icon: Folder, end: false },
  { to: '/admin/posts', label: '博客', icon: FileText, end: false },
  { to: '/admin/settings', label: '设置', icon: Settings, end: false },
]

/** 后台独立布局：侧边栏 + 顶栏，不复用前台 Navbar */
export function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
      isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface hover:text-text'
    }`

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border/60 bg-surface/40 p-4 md:flex">
        <Link to="/" className="mb-6 px-3 text-lg font-semibold text-text">
          Portfolio
        </Link>
        <nav className="flex flex-col gap-1" aria-label="后台导航">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-text"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </aside>

      {/* 右侧内容区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 px-6">
          <span className="text-sm text-muted">内容管理</span>
          <span className="text-sm text-muted">管理员</span>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
