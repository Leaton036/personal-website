import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, Mail } from 'lucide-react'
import { getProfile } from '@/api'
import type { Profile } from '@/types'

// CTA 按钮统一样式，保证三个按钮视觉一致
const primaryLinkClass =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-medium text-white transition-colors hover:bg-accent/85'
const secondaryLinkClass =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-base font-medium text-text transition-colors hover:border-accent/40 hover:bg-border/40'

/** 首页 Hero 模块 */
export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data)
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

  if (loading) return <HeroSkeleton />
  if (!profile) return <HeroEmpty />

  // 头像为空时回退为姓名首字
  const initial = profile.name?.trim().charAt(0) || 'P'

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1200px] flex-col items-center justify-center px-4 py-16 text-center">
      {/* 头像（圆形 + 光晕） */}
      <div className="relative mb-8">
        <div className="absolute -inset-3 rounded-full bg-accent/25 blur-2xl" aria-hidden="true" />
        <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-accent/40 bg-surface text-4xl font-semibold text-accent shadow-lg shadow-accent/30">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.name} 的头像`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initial}</span>
          )}
        </div>
      </div>

      {/* 姓名 + 职位 */}
      <h1 className="text-4xl font-bold leading-tight md:text-5xl">{profile.name}</h1>
      <p className="mt-3 text-xl font-medium text-accent">{profile.title}</p>

      {/* 一句话介绍 */}
      {profile.bio && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{profile.bio}</p>
      )}

      {/* CTA 按钮组 */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link to="/projects" className={primaryLinkClass}>
          看项目
          <ArrowRight size={18} />
        </Link>
        {/* TODO: 简历文件就绪后改为触发下载（如指向 /resume.pdf） */}
        <button type="button" className={secondaryLinkClass} title="简历暂未上传">
          <Download size={18} />
          下载简历
        </button>
        <Link to="/contact" className={secondaryLinkClass}>
          <Mail size={18} />
          联系我
        </Link>
      </div>
    </section>
  )
}

/** 加载中骨架屏 */
function HeroSkeleton() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1200px] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="h-28 w-28 animate-pulse rounded-full bg-surface" />
      <div className="mt-6 h-9 w-56 animate-pulse rounded-lg bg-surface" />
      <div className="mt-3 h-6 w-40 animate-pulse rounded-lg bg-surface" />
      <div className="mt-4 h-16 w-full max-w-2xl animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <div className="h-12 w-32 animate-pulse rounded-xl bg-surface" />
        <div className="h-12 w-32 animate-pulse rounded-xl bg-surface" />
        <div className="h-12 w-32 animate-pulse rounded-xl bg-surface" />
      </div>
    </section>
  )
}

/** 空状态引导 */
function HeroEmpty() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1200px] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">欢迎来到我的作品集</h1>
      <p className="mt-3 text-muted">个人信息尚未配置，请前往后台完善。</p>
      <Link to="/admin/login" className="mt-6 text-accent hover:underline">
        前往后台
      </Link>
    </section>
  )
}
