import type { Profile } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage'

/** 获取个人信息 */
export async function getProfile(): Promise<Profile | null> {
  return readStorage<Profile>(STORAGE_KEYS.PROFILE)
}

/** 更新个人信息 */
export async function updateProfile(profile: Profile): Promise<Profile> {
  writeStorage(STORAGE_KEYS.PROFILE, profile)
  return profile
}
