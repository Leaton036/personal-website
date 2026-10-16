import type { Skill } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage'

/** 获取全部技能 */
export async function getSkills(): Promise<Skill[]> {
  return readStorage<Skill[]>(STORAGE_KEYS.SKILLS) ?? []
}

/** 新增技能 */
export async function createSkill(skill: Skill): Promise<Skill> {
  const list = await getSkills()
  const next = [...list, skill]
  writeStorage(STORAGE_KEYS.SKILLS, next)
  return skill
}

/** 更新技能 */
export async function updateSkill(id: string, patch: Partial<Skill>): Promise<Skill | null> {
  const list = await getSkills()
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) return null
  const updated = { ...list[index], ...patch, id }
  list[index] = updated
  writeStorage(STORAGE_KEYS.SKILLS, list)
  return updated
}

/** 删除技能 */
export async function deleteSkill(id: string): Promise<void> {
  const list = await getSkills()
  writeStorage(
    STORAGE_KEYS.SKILLS,
    list.filter((item) => item.id !== id),
  )
}
