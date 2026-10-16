import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react'
import { getProjectById } from '@/api'
import { Markdown } from '@/components/ui/Markdown'
import { formatDate } from '@/utils/format'
import type { Project } from '@/types'

/** 项目详情页 */
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setProject(null)

    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    getProjectById(id)
      .then((data) => {
        if (cancelled) return
        if (data) setProject(data)
        else setNotFound(true)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <DetailSkeleton />
  if (notFound || !project) return <DetailNotFound />

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        返回项目列表
      </Link>

      {/* 封面 */}
      {project.cover && (
        <img
          src={project.cover}
          alt={project.title}
          className="mt-6 aspect-video w-full rounded-card border border-border object-cover"
        />
      )}

      {/* 标题 */}
      <h1 className="mt-8 text-3xl font-bold md:text-4xl">{project.title}</h1>

      {/* 元信息 */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        {project.date && <span>{formatDate(project.date)}</span>}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            <ExternalLink size={14} aria-hidden="true" />
            访问链接
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            <GitBranch size={14} aria-hidden="true" />
            GitHub
          </a>
        )}
      </div>

      {/* 标签 */}
      {project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 描述 */}
      {project.description && <p className="mt-6 text-lg text-muted">{project.description}</p>}

      {/* Markdown 详情 */}
      {project.content && (
        <div className="mt-10 border-t border-border/60 pt-8">
          <Markdown content={project.content} />
        </div>
      )}
    </section>
  )
}

/** 加载中骨架屏 */
function DetailSkeleton() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <div className="h-5 w-28 animate-pulse rounded bg-surface" />
      <div className="mt-6 aspect-video w-full animate-pulse rounded-card bg-surface" />
      <div className="mt-8 h-9 w-2/3 animate-pulse rounded-lg bg-surface" />
      <div className="mt-4 h-5 w-1/3 animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 h-40 animate-pulse rounded-card bg-surface" />
    </section>
  )
}

/** 项目不存在（404） */
function DetailNotFound() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">项目不存在</h1>
      <p className="mt-3 text-muted">未找到该项目，可能已被删除。</p>
      <Link
        to="/projects"
        className="mt-6 inline-flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        返回项目列表
      </Link>
    </section>
  )
}
