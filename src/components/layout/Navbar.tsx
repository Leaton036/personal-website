import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: '首页' },
  { to: '/about', label: '介绍' },
  { to: '/skills', label: '技能' },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
  { to: '/contact', label: '联系' },
]

/** 前台吸顶导航（毛玻璃 + 移动端汉堡菜单） */
export function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive ? 'text-accent' : 'text-muted hover:text-text'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold text-text">
          Portfolio
        </Link>

        {/* 桌面端导航 */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:text-text md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* 移动端菜单 */}
      {open && (
        <ul className="border-t border-border/60 px-4 py-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm ${
                    isActive ? 'text-accent' : 'text-muted hover:text-text'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
