import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Starfield } from '@/components/starfield/Starfield'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { AppRoutes } from './router'

export default function App() {
  const settings = useSiteSettings()

  // 将站点设置应用到全局：强调色 CSS 变量 + 页面标题
  useEffect(() => {
    if (!settings) return
    document.documentElement.style.setProperty('--color-accent', settings.accentColor)
    if (settings.siteName) document.title = settings.siteName
  }, [settings])

  return (
    <BrowserRouter>
      <Starfield />
      <AppRoutes />
    </BrowserRouter>
  )
}
