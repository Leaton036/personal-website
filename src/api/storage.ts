// 内部 localStorage 封装，仅供 src/api/ 层使用。
// 组件禁止直接操作 localStorage，统一通过 api 层读写数据。

/** 存储键统一管理（UPPER_SNAKE_CASE 常量） */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'portfolio:auth_token',
  PROFILE: 'portfolio:profile',
  SKILLS: 'portfolio:skills',
  PROJECTS: 'portfolio:projects',
  POSTS: 'portfolio:posts',
  SETTINGS: 'portfolio:settings',
} as const

/** 读取并反序列化 */
export function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

/** 序列化并写入 */
export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/** 删除指定键 */
export function removeStorage(key: string): void {
  localStorage.removeItem(key)
}
