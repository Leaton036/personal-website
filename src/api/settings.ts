import type { SiteSettings } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage'

/** 默认站点设置 */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Personal Portfolio',
  accentColor: '#3B82F6',
  footerText: '© 2026 Personal Portfolio. All rights reserved.',
}

/** 获取站点设置 */
export async function getSettings(): Promise<SiteSettings> {
  return readStorage<SiteSettings>(STORAGE_KEYS.SETTINGS) ?? DEFAULT_SETTINGS
}

/** 更新站点设置 */
export async function updateSettings(settings: SiteSettings): Promise<SiteSettings> {
  writeStorage(STORAGE_KEYS.SETTINGS, settings)
  return settings
}
