import type { AuthToken } from '@/types'
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from './storage'

// token 有效期：24 小时
const TOKEN_TTL = 24 * 60 * 60 * 1000

/**
 * 登录：校验用户名密码后生成模拟 token。
 * 注意：不存储明文密码，仅存储 token。
 */
export async function login(username: string, password: string): Promise<AuthToken> {
  if (!username || !password) {
    throw new Error('用户名或密码不能为空')
  }
  // TODO: 后续接入真实后端时替换为服务端校验
  const token: AuthToken = {
    token: crypto.randomUUID(),
    expiresAt: Date.now() + TOKEN_TTL,
  }
  writeStorage(STORAGE_KEYS.AUTH_TOKEN, token)
  return token
}

/** 登出：清除本地 token */
export async function logout(): Promise<void> {
  removeStorage(STORAGE_KEYS.AUTH_TOKEN)
}

/** 获取当前 token */
export function getToken(): AuthToken | null {
  return readStorage<AuthToken>(STORAGE_KEYS.AUTH_TOKEN)
}

/** 是否已登录（token 存在且未过期） */
export function isAuthenticated(): boolean {
  const token = getToken()
  return !!token && token.expiresAt > Date.now()
}
