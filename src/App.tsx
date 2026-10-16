import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Starfield } from '@/components/starfield/Starfield'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { AppRoutes } from './router'

/** 将十六进制颜色按比例压暗（用于派生按钮实底色，保证白字对比度达 AA） */
function darken(hex: string, amount = 0.18): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return '#2563eb'
  const n = parseInt(m[1], 16)
  const r = Math.round(((n >> 16) & 255) * (1 - amount))
  const g = Math.round(((n >> 8) & 255) * (1 - amount))
  const b = Math.round((n & 255) * (1 - amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export default function App() {
  const settings = useSiteSettings()

  // 将站点设置应用到全局：强调色 CSS 变量 + 页面标题
  useEffect(() => {
    if (!settings) return
    document.documentElement.style.setProperty('--color-accent', settings.accentColor)
    document.documentElement.style.setProperty('--color-accent-strong', darken(settings.accentColor))
    if (settings.siteName) document.title = settings.siteName
  }, [settings])

  return (
    <BrowserRouter>
      <Starfield />
      <AppRoutes />
    </BrowserRouter>
  )
}
