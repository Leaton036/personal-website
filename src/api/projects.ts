import type { Project } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage'

/** 获取全部项目 */
export async function getProjects(): Promise<Project[]> {
  return readStorage<Project[]>(STORAGE_KEYS.PROJECTS) ?? []
}

/** 按 id 获取单个项目 */
export async function getProjectById(id: string): Promise<Project | null> {
  const list = await getProjects()
  return list.find((item) => item.id === id) ?? null
}

/** 新增项目 */
export async function createProject(project: Project): Promise<Project> {
  const list = await getProjects()
  const next = [...list, project]
  writeStorage(STORAGE_KEYS.PROJECTS, next)
  return project
}

/** 更新项目 */
export async function updateProject(id: string, patch: Partial<Project>): Promise<Project | null> {
  const list = await getProjects()
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) return null
  const updated = { ...list[index], ...patch, id }
  list[index] = updated
  writeStorage(STORAGE_KEYS.PROJECTS, list)
  return updated
}

/** 删除项目 */
export async function deleteProject(id: string): Promise<void> {
  const list = await getProjects()
  writeStorage(
    STORAGE_KEYS.PROJECTS,
    list.filter((item) => item.id !== id),
  )
}
