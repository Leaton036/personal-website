import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/api'

/**
 * 路由守卫：拦截未登录访问后台。
 * 已登录则渲染子路由，未登录跳转登录页。
 */
export function RequireAuth() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
