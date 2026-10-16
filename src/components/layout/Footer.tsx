import { useSiteSettings } from '@/hooks/useSiteSettings'

/** 前台页脚：页脚文字与 ICP 备案号来自站点设置 */
export function Footer() {
  const settings = useSiteSettings()

  return (
    <footer className="border-t border-border/60 py-8 text-center text-sm text-muted">
      {settings?.footerText ? <p>{settings.footerText}</p> : <p>© 2026 Personal Portfolio. All rights reserved.</p>}
      {settings?.icp && <p className="mt-2 text-xs">{settings.icp}</p>}
    </footer>
  )
}
