import type { Post, Profile, Project, Skill } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from '@/api'

/** 示例个人信息 */
export const seedProfile: Profile = {
  name: '你的名字',
  title: '全栈开发工程师',
  avatar: '',
  bio: '热爱用代码创造价值，专注于构建现代化的 Web 应用。',
  email: 'hello@example.com',
  social: [{ platform: 'GitHub', url: 'https://github.com' }],
  experiences: [
    {
      company: '示例公司',
      role: '前端工程师',
      period: '2024 - 至今',
      desc: '负责核心产品的前端架构与开发。',
    },
  ],
  education: [{ school: '示例大学', degree: '计算机科学与技术', period: '2020 - 2024' }],
}

/** 示例技能 */
export const seedSkills: Skill[] = [
  { id: 'skill-1', category: '前端', name: 'React', icon: 'react', level: 90 },
  { id: 'skill-2', category: '前端', name: 'TypeScript', icon: 'typescript', level: 85 },
  { id: 'skill-3', category: '后端', name: 'Node.js', icon: 'node', level: 80 },
]

/** 示例项目 */
export const seedProjects: Project[] = [
  {
    id: 'project-1',
    title: '个人作品集网站',
    description: '基于 React 18 + TypeScript + Vite 的个人作品集。',
    cover: '',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    link: '#',
    content: '## 项目简介\n\n这是一个个人作品集网站。',
    date: '2026-10-01',
  },
]

/** 示例博客 */
export const seedPosts: Post[] = [
  {
    id: 'post-1',
    title: '你好，世界',
    summary: '这是我的第一篇博客。',
    tags: ['随笔'],
    date: '2026-10-01',
    content: '# 你好，世界\n\n欢迎来到我的博客。',
  },
]

/**
 * 首次加载时初始化 localStorage 种子数据（仅当对应键不存在时写入）。
 * 在 main.tsx 中调用一次。
 */
export function seedIfEmpty(): void {
  if (readStorage(STORAGE_KEYS.PROFILE) === null) writeStorage(STORAGE_KEYS.PROFILE, seedProfile)
  if (readStorage(STORAGE_KEYS.SKILLS) === null) writeStorage(STORAGE_KEYS.SKILLS, seedSkills)
  if (readStorage(STORAGE_KEYS.PROJECTS) === null) writeStorage(STORAGE_KEYS.PROJECTS, seedProjects)
  if (readStorage(STORAGE_KEYS.POSTS) === null) writeStorage(STORAGE_KEYS.POSTS, seedPosts)
}
