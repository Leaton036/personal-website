import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'
import { getPosts } from '@/api'
import { formatDate } from '@/utils/format'
import type { Post } from '@/types'

/** 博客卡片：可选封面 + 元信息 + 标题 + 摘要 */
function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group flex flex-col gap-4 rounded-card border border-border bg-surface/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 sm:flex-row sm:gap-6"
    >
      {/* 可选封面图 */}
      {post.cover && (
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          className="aspect-video w-full shrink-0 rounded-lg border border-border/60 object-cover sm:aspect-auto sm:h-28 sm:w-48"
        />
      )}

      <div className="min-w-0 flex-1">
        {/* 元信息：日期 + 标签 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <time className="inline-flex items-center gap-1.5">
            <Calendar size={13} aria-hidden="true" />
            {formatDate(post.date)}
          </time>
          {post.tags.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Tag size={13} aria-hidden="true" />
              {post.tags.join(' / ')}
            </span>
          )}
        </div>

        <h2 className="mt-2 text-lg font-semibold transition-colors group-hover:text-accent">
          {post.title}
        </h2>

        {post.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.summary}</p>
        )}
      </div>
    </Link>
  )
}

/** 博客列表页（按日期倒序） */
export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPosts()
      .then((data) => {
        if (!cancelled) setPosts(data)
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

  if (loading) return <BlogSkeleton />
  if (posts.length === 0) return <BlogEmpty />

  // 按日期倒序排列
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">博客</h1>
      <p className="mt-3 text-muted">记录技术思考与个人随笔。</p>

      <div className="mt-10 space-y-4">
        {sorted.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

/** 加载中骨架屏 */
function BlogSkeleton() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <div className="h-9 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-3 h-5 w-64 animate-pulse rounded-lg bg-surface" />
      <div className="mt-10 space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex animate-pulse flex-col gap-4 rounded-card border border-border bg-surface/60 p-5 sm:flex-row sm:gap-6"
          >
            <div className="aspect-video w-full shrink-0 rounded-lg bg-border/40 sm:aspect-auto sm:h-28 sm:w-48" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-56 rounded bg-border/40" />
              <div className="h-6 w-2/3 rounded-lg bg-border/40" />
              <div className="h-4 w-full rounded bg-border/40" />
              <div className="h-4 w-4/5 rounded bg-border/40" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** 空状态引导 */
function BlogEmpty() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">博客</h1>
      <p className="mt-6 text-muted">博客文章尚未发布，请前往后台添加。</p>
      <Link to="/admin/login" className="mt-6 inline-block text-accent hover:underline">
        前往后台
      </Link>
    </section>
  )
}
