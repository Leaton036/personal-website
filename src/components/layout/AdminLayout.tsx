import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FileText,
  Folder,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Wrench,
  X,
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

/** 后台独立布局：侧边栏 + 顶栏（移动端汉堡菜单），不复用前台 Navbar */
export function AdminLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
      {/* 桌面端侧边栏 */}
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
        <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* 移动端菜单按钮 */}
            <button
              type="button"
              className="rounded-lg p-2 text-muted hover:text-text md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? '关闭菜单' : '打开菜单'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-sm text-muted">内容管理</span>
          </div>
          <span className="text-sm text-muted">管理员</span>
        </header>

        {/* 移动端下拉菜单 */}
        {open && (
          <nav className="border-b border-border/60 px-4 py-3 md:hidden" aria-label="后台导航">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface hover:text-text'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-text"
            >
              <LogOut size={18} />
              退出登录
            </button>
          </nav>
        )}

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
