import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { getPostById } from '@/api'
import { Markdown } from '@/components/ui/Markdown'
import { extractHeadings, type Heading } from '@/utils/markdown'
import { formatDate } from '@/utils/format'
import type { Post } from '@/types'

/** 目录列表：按标题层级缩进，高亮当前阅读位置 */
function TocList({ headings, activeId }: { headings: Heading[]; activeId: string }) {
  const minLevel = Math.min(...headings.map((h) => h.level))

  return (
    <nav aria-label="文章目录">
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - minLevel) * 12}px` }}>
            <a
              href={`#${h.id}`}
              className={`block rounded-md px-2 py-1 text-sm leading-snug transition-colors ${
                activeId === h.id ? 'text-accent' : 'text-muted hover:text-text'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** 博客详情页 */
export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeId, setActiveId] = useState('')
  const articleRef = useRef<HTMLDivElement>(null)

  // 加载博客
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setPost(null)

    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    getPostById(id)
      .then((data) => {
        if (cancelled) return
        if (data) setPost(data)
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

  const headings = post ? extractHeadings(post.content) : []

  // 滚动监听：高亮当前可见标题
  useEffect(() => {
    if (!post) return
    const root = articleRef.current
    if (!root) return

    const headingEls = Array.from(
      root.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'),
    )
    if (headingEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 取视口顶部最近的可见标题
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -60% 0px' },
    )

    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [post])

  if (loading) return <DetailSkeleton />
  if (notFound || !post) return <DetailNotFound />

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        返回博客列表
      </Link>

      {/* 封面（可选） */}
      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          className="mt-6 aspect-video w-full rounded-card border border-border object-cover"
        />
      )}

      {/* 标题 */}
      <h1 className="mt-8 text-3xl font-bold md:text-4xl">{post.title}</h1>

      {/* 元信息 */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        <time className="inline-flex items-center gap-1.5">
          <Calendar size={14} aria-hidden="true" />
          {formatDate(post.date)}
        </time>
      </div>

      {/* 标签 */}
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">
              <Tag size={12} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 移动端目录（顶部可折叠） */}
      {headings.length > 0 && (
        <details className="mt-6 rounded-card border border-border bg-surface/40 p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-text">目录</summary>
          <div className="mt-3">
            <TocList headings={headings} activeId={activeId} />
          </div>
        </details>
      )}

      {/* 正文 + 右侧 TOC 两栏布局（>1024px） */}
      <div className="mt-8 flex gap-10 lg:items-start">
        <article ref={articleRef} className="min-w-0 flex-1 border-t border-border/60 pt-8">
          <Markdown content={post.content} />
        </article>

        {headings.length > 0 && (
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-card border border-border bg-surface/40 p-4">
              <h2 className="mb-3 text-sm font-semibold text-text">目录</h2>
              <TocList headings={headings} activeId={activeId} />
            </div>
          </aside>
        )}
      </div>
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

/** 文章不存在（404） */
function DetailNotFound() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">文章不存在</h1>
      <p className="mt-3 text-muted">未找到该文章，可能已被删除。</p>
      <Link
        to="/blog"
        className="mt-6 inline-flex items-center gap-2 text-accent hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        返回博客列表
      </Link>
    </section>
  )
}
