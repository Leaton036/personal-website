// 集中管理所有数据模型类型定义

/** 个人信息 */
export interface Profile {
  name: string
  title: string
  avatar: string
  bio: string
  email: string
  social: { platform: string; url: string }[]
  experiences: { company: string; role: string; period: string; desc: string }[]
  education: { school: string; degree: string; period: string }[]
}

/** 技能 */
export interface Skill {
  id: string
  category: string // 如 "前端"、"后端"、"工具"
  name: string
  icon: string
  level: number // 0~100
}

/** 项目 */
export interface Project {
  id: string
  title: string
  description: string
  cover: string
  tags: string[]
  link: string
  repo?: string
  content: string // Markdown 详情
  date: string
}

/** 博客 */
export interface Post {
  id: string
  title: string
  summary: string
  cover?: string
  tags: string[]
  date: string
  content: string // Markdown 正文
}

/** 站点设置 */
export interface SiteSettings {
  siteName: string
  accentColor: string
  footerText: string
  icp?: string
}

/** 登录态 */
export interface AuthToken {
  token: string
  expiresAt: number
}
