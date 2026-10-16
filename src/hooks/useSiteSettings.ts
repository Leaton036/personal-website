import { useEffect, useState } from 'react'
import { getSettings } from '@/api'
import type { SiteSettings } from '@/types'

/**
 * 站点设置 Hook：读取全局设置。
 * 组件卸载/竞态保护，读取失败返回 null（调用方按默认值兜底）。
 */
export function useSiteSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    let cancelled = false
    getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data)
      })
      .catch(() => {
        // 读取失败按默认设置处理
      })
    return () => {
      cancelled = true
    }
  }, [])

  return settings
}
