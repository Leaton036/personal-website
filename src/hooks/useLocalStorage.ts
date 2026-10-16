import { useCallback, useState } from 'react'

/**
 * 通用 localStorage 状态 Hook（用于 UI 偏好等非业务数据）。
 * 业务数据请统一走 src/api/ 接口层，不要使用此 Hook。
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // 忽略写入失败（如隐私模式）
        }
        return next
      })
    },
    [key],
  )

  return [storedValue, setValue] as const
}
