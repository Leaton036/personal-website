import type { Post, Profile, Project, Skill } from '@/types'
import { STORAGE_KEYS, readStorage, writeStorage } from '@/api'

/** 示例个人信息 */
export const seedProfile: Profile = {
  name: '你的名字',
  title: '全栈开发工程师',
  avatar: '',
  bio: '热爱用代码创造价值，专注于构建现代化的 Web 应用。拥有多年前后端开发经验，擅长性能优化与前端工程化建设。',
  email: 'hello@example.com',
  social: [{ platform: 'GitHub', url: 'https://github.com' }],
  experiences: [
    {
      company: '示例科技公司',
      role: '高级前端工程师',
      period: '2024 - 至今',
      desc: '负责核心产品的前端架构设计与性能优化，主导组件库与工程化建设。',
    },
    {
      company: '示例互联网公司',
      role: '前端工程师',
      period: '2022 - 2024',
      desc: '参与多个大型项目开发，从 0 到 1 搭建前端工程，推动团队代码规范落地。',
    },
    {
      company: '示例创业团队',
      role: '全栈开发（实习）',
      period: '2021 - 2022',
      desc: '参与产品早期版本开发，负责前后端基础功能与数据看板实现。',
    },
  ],
  education: [
    { school: '示例大学', degree: '计算机科学与技术 · 本科', period: '2017 - 2021' },
    { school: '示例高级中学', degree: '理科', period: '2014 - 2017' },
  ],
}

/** 示例技能 */
export const seedSkills: Skill[] = [
  { id: 'skill-1', category: '前端', name: 'React', icon: 'atom', level: 90 },
  { id: 'skill-2', category: '前端', name: 'TypeScript', icon: 'braces', level: 85 },
  { id: 'skill-3', category: '前端', name: 'TailwindCSS', icon: 'palette', level: 88 },
  { id: 'skill-4', category: '后端', name: 'Node.js', icon: 'server', level: 82 },
  { id: 'skill-5', category: '后端', name: 'Python', icon: 'terminal', level: 75 },
  { id: 'skill-6', category: '后端', name: 'MySQL', icon: 'database', level: 70 },
  { id: 'skill-7', category: '工具', name: 'Git', icon: 'git-branch', level: 85 },
  { id: 'skill-8', category: '工具', name: 'Docker', icon: 'container', level: 65 },
  { id: 'skill-9', category: '工具', name: 'Figma', icon: 'pen-tool', level: 60 },
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
