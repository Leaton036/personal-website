import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { getProjects } from '@/api'
import type { Project } from '@/types'

/** 项目卡片：整卡可跳详情，外链通过 z-10 置于其上 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative overflow-hidden rounded-card border border-border bg-surface/60 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40">
      {/* 封面 16:9 */}
      <div className="aspect-video w-full overflow-hidden bg-surface">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            暂无封面
          </div>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold transition-colors group-hover:text-accent">
          {project.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">
                {tag}
              </span>
            ))}
          </div>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            <ExternalLink size={14} aria-hidden="true" />
            访问链接
          </a>
        )}
      </div>

      {/* 覆盖整卡的内链，跳详情页 */}
      <Link
        to={`/projects/${project.id}`}
        className="absolute inset-0"
        aria-label={`查看项目：${project.title}`}
      />
    </div>
  )
}

/** 项目展示页 */
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(data)
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

  if (loading) return <ProjectsSkeleton />
  if (projects.length === 0) return <ProjectsEmpty />

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">项目</h1>
      <p className="mt-3 text-muted">我做过的部分项目，点击卡片查看详情。</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

/** 加载中骨架屏 */
function ProjectsSkeleton() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <div className="h-9 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-3 h-5 w-64 animate-pulse rounded-lg bg-surface" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-card bg-surface">
            <div className="aspect-video w-full bg-border/40" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-2/3 rounded-lg bg-border/40" />
              <div className="h-4 w-full rounded-lg bg-border/40" />
              <div className="h-4 w-4/5 rounded-lg bg-border/40" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** 空状态引导 */
function ProjectsEmpty() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">项目</h1>
      <p className="mt-6 text-muted">项目数据尚未配置，请前往后台添加。</p>
      <Link to="/admin/login" className="mt-6 inline-block text-accent hover:underline">
        前往后台
      </Link>
    </section>
  )
}
