import { useCallback } from 'react'
import { isAuthenticated as checkAuth, logout as apiLogout } from '@/api'

/**
 * 登录态 Hook：封装 api 层的鉴权方法。
 * 当前为同步校验（读 localStorage），后续接入后端可平滑替换。
 */
export function useAuth() {
  const isAuthenticated = checkAuth()

  const logout = useCallback(async () => {
    await apiLogout()
  }, [])

  return { isAuthenticated, logout }
}
