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
    description: '基于 React 18 + TypeScript + Vite 的个人作品集，包含前台展示与后台管理。',
    cover: 'https://picsum.photos/seed/portfolio/800/450',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    link: 'https://example.com',
    repo: 'https://github.com/yourname/portfolio',
    content: [
      '## 项目简介',
      '',
      '一个深色星空主题的个人作品集网站，支持前台展示（介绍、技能、项目、博客）与后台可视化管理，数据本地存储、API 层抽象。',
      '',
      '## 功能特性',
      '',
      '- 星空 Canvas 粒子背景，尊重系统动效偏好',
      '- 响应式布局，适配桌面与移动端',
      '- 后台可视化管理个人信息、技能、项目与博客',
      '',
      '## 技术栈',
      '',
      '| 层 | 技术 |',
      '| --- | --- |',
      '| 框架 | React 18 |',
      '| 语言 | TypeScript |',
      '| 构建 | Vite |',
      '| 样式 | TailwindCSS |',
      '',
      '## 核心实现',
      '',
      '```ts',
      'export async function getProjects(): Promise<Project[]> {',
      '  return readStorage<Project[]>(STORAGE_KEYS.PROJECTS) ?? []',
      '}',
      '```',
    ].join('\n'),
    date: '2026-10-01',
  },
  {
    id: 'project-2',
    title: '任务管理应用',
    description: '支持看板视图与拖拽排序的任务管理工具，数据本地持久化。',
    cover: 'https://picsum.photos/seed/taskflow/800/450',
    tags: ['React', 'Zustand', 'dnd-kit'],
    link: 'https://example.com',
    repo: 'https://github.com/yourname/taskflow',
    content: [
      '## 项目简介',
      '',
      '一个支持看板视图与拖拽排序的任务管理应用。',
      '',
      '## 功能特性',
      '',
      '- 看板 / 列表双视图',
      '- 拖拽排序与状态流转',
      '- 数据实时本地持久化',
      '',
      '## 使用说明',
      '',
      '1. 创建任务并填写标题与描述',
      '2. 拖动卡片切换状态',
      '3. 双击卡片编辑详情',
    ].join('\n'),
    date: '2026-08-15',
  },
  {
    id: 'project-3',
    title: '数据可视化看板',
    description: '多数据源接入、可自定义图表的数据可视化看板。',
    cover: 'https://picsum.photos/seed/dashboard/800/450',
    tags: ['React', 'ECharts', 'Vite'],
    link: 'https://example.com',
    content: [
      '## 项目简介',
      '',
      '一个基于图表库的数据可视化看板，支持多数据源接入与自定义图表。',
      '',
      '## 功能特性',
      '',
      '- 折线图 / 柱状图 / 饼图',
      '- 拖拽式仪表盘布局',
      '- 数据自动刷新',
      '',
      '## 示例代码',
      '',
      '```js',
      'const chart = new Chart(ctx, {',
      '  type: "line",',
      '  data: { labels, datasets },',
      '})',
      '```',
    ].join('\n'),
    date: '2026-06-20',
  },
  {
    id: 'project-4',
    title: '开源工具库',
    description: '轻量级日期时间处理工具库，API 简洁、零依赖。',
    cover: 'https://picsum.photos/seed/utils/800/450',
    tags: ['TypeScript', 'Node.js', 'npm'],
    link: 'https://example.com',
    repo: 'https://github.com/yourname/date-utils',
    content: [
      '## 项目简介',
      '',
      '一个轻量级的日期与时间处理工具库，API 简洁、零依赖。',
      '',
      '## 功能特性',
      '',
      '- 支持多种日期格式解析与格式化',
      '- 时区与相对时间计算',
      '- 完整的 TypeScript 类型',
      '',
      '## 安装',
      '',
      '```bash',
      'npm install @example/date-utils',
      '```',
    ].join('\n'),
    date: '2026-04-10',
  },
  {
    id: 'project-5',
    title: '移动端天气应用',
    description: '简洁的移动端天气应用，实时天气与未来一周预报。',
    cover: 'https://picsum.photos/seed/weather/800/450',
    tags: ['React Native', 'Expo', 'OpenWeather'],
    link: 'https://example.com',
    content: [
      '## 项目简介',
      '',
      '一个简洁的移动端天气应用，支持实时天气与未来一周预报。',
      '',
      '## 功能特性',
      '',
      '- 基于定位的实时天气',
      '- 未来 7 天预报',
      '- 深色 / 浅色主题',
    ].join('\n'),
    date: '2026-02-05',
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
