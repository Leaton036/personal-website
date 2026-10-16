import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Folder, User, Wrench } from 'lucide-react'
import { getPosts, getProfile, getProjects, getSkills } from '@/api'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/utils/format'
import type { Post, Project } from '@/types'

interface StatItem {
  label: string
  value: number
  to: string
  icon: typeof Folder
}

/** 最近更新项（项目 / 博客混合） */
interface RecentItem {
  id: string
  title: string
  date: string
  type: '项目' | '博客'
}

/** 后台仪表盘 */
export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ projects: number; posts: number; skills: number; profile: boolean }>({
    projects: 0,
    posts: 0,
    skills: 0,
    profile: false,
  })
  const [recent, setRecent] = useState<RecentItem[]>([])

  useEffect(() => {
    let cancelled = false
    Promise.all([getProjects(), getPosts(), getSkills(), getProfile()])
      .then(([projects, posts, skills, profile]) => {
        if (cancelled) return
        setStats({ projects: projects.length, posts: posts.length, skills: skills.length, profile: !!profile })

        // 合并项目与博客，按日期倒序取前 5 条
        const items: RecentItem[] = [
          ...projects.map<RecentItem>((p: Project) => ({ id: p.id, title: p.title, date: p.date, type: '项目' })),
          ...posts.map<RecentItem>((p: Post) => ({ id: p.id, title: p.title, date: p.date, type: '博客' })),
        ].sort((a, b) => b.date.localeCompare(a.date))
        setRecent(items.slice(0, 5))
      })
      .catch(() => {
        // 读取失败按空数据处理
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <DashboardSkeleton />

  const statItems: StatItem[] = [
    { label: '项目', value: stats.projects, to: '/admin/projects', icon: Folder },
    { label: '博客', value: stats.posts, to: '/admin/posts', icon: FileText },
    { label: '技能', value: stats.skills, to: '/admin/skills', icon: Wrench },
    { label: '个人信息', value: stats.profile ? 1 : 0, to: '/admin/profile', icon: User },
  ]

  return (
    <div className="mx-auto max-w-[1000px]">
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <p className="mt-2 text-sm text-muted">内容统计概览。</p>

      {/* 统计卡片 */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.to}
              className="group rounded-card border border-border bg-surface/60 p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-2 text-muted">
                <Icon size={16} aria-hidden="true" />
                <span className="text-sm">{item.label}</span>
              </div>
              <p className="mt-3 text-3xl font-semibold transition-colors group-hover:text-accent">
                {item.value}
              </p>
            </Link>
          )
        })}
      </div>

      {/* 最近更新 */}
      <h2 className="mt-10 text-lg font-semibold">最近更新</h2>
      {recent.length > 0 ? (
        <Card className="mt-4">
          <ul className="divide-y divide-border/60">
            {recent.map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  {item.type}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                <span className="shrink-0 text-xs text-muted">{formatDate(item.date)}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <p className="mt-4 text-sm text-muted">暂无内容。</p>
      )}
    </div>
  )
}

/** 加载中骨架屏 */
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-card bg-surface" />
        ))}
      </div>
      <div className="mt-10 h-6 w-24 animate-pulse rounded bg-surface" />
      <div className="mt-4 h-48 animate-pulse rounded-card bg-surface" />
    </div>
  )
}
