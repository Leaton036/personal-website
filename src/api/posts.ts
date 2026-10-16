import type { Post } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from './storage'

/** 获取全部博客 */
export async function getPosts(): Promise<Post[]> {
  return readStorage<Post[]>(STORAGE_KEYS.POSTS) ?? []
}

/** 按 id 获取单篇博客 */
export async function getPostById(id: string): Promise<Post | null> {
  const list = await getPosts()
  return list.find((item) => item.id === id) ?? null
}

/** 新增博客 */
export async function createPost(post: Post): Promise<Post> {
  const list = await getPosts()
  const next = [...list, post]
  writeStorage(STORAGE_KEYS.POSTS, next)
  return post
}

/** 更新博客 */
export async function updatePost(id: string, patch: Partial<Post>): Promise<Post | null> {
  const list = await getPosts()
  const index = list.findIndex((item) => item.id === id)
  if (index === -1) return null
  const updated = { ...list[index], ...patch, id }
  list[index] = updated
  writeStorage(STORAGE_KEYS.POSTS, list)
  return updated
}

/** 删除博客 */
export async function deletePost(id: string): Promise<void> {
  const list = await getPosts()
  writeStorage(
    STORAGE_KEYS.POSTS,
    list.filter((item) => item.id !== id),
  )
}
