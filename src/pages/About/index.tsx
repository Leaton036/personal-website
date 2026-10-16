import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap } from 'lucide-react'
import { getProfile } from '@/api'
import { Card } from '@/components/ui/Card'
import type { Profile } from '@/types'

/** 从时间段字符串提取排序权重；进行中的经历（含「至今」）排最前 */
function periodRank(period: string): number {
  if (/至今|现在|present/i.test(period)) return Number.MAX_SAFE_INTEGER
  const match = period.match(/(\d{4})/)
  return match ? Number(match[1]) : 0
}

/** 个人介绍页 */
export default function About() {
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

  if (loading) return <AboutSkeleton />
  if (!profile) return <AboutEmpty />

  // 经历按时间倒序排列
  const experiences = [...profile.experiences].sort(
    (a, b) => periodRank(b.period) - periodRank(a.period),
  )

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">关于我</h1>

      {/* 简介段落 */}
      {profile.bio && (
        <p className="mt-6 max-w-3xl text-lg leading-[1.8] text-muted">{profile.bio}</p>
      )}

      {/* 经历时间线 */}
      <h2 className="mt-16 flex items-center gap-2 text-2xl font-semibold">
        <Briefcase size={22} className="text-accent" aria-hidden="true" />
        工作经历
      </h2>
      <div className="relative mt-8 max-w-3xl">
        {experiences.length > 0 ? (
          <>
            {/* 竖向时间线 */}
            <div
              className="absolute bottom-2 left-[7px] top-2 w-px bg-border"
              aria-hidden="true"
            />
            <ul className="space-y-10">
              {experiences.map((exp, index) => (
                <li key={index} className="relative pl-8">
                  {/* 时间线圆点 */}
                  <span
                    className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-muted">{exp.period}</p>
                  <h3 className="mt-1 text-lg font-semibold">{exp.company}</h3>
                  <p className="text-sm font-medium text-accent">{exp.role}</p>
                  {exp.desc && <p className="mt-2 leading-relaxed text-muted">{exp.desc}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-muted">暂无工作经历。</p>
        )}
      </div>

      {/* 教育背景 */}
      <h2 className="mt-16 flex items-center gap-2 text-2xl font-semibold">
        <GraduationCap size={22} className="text-accent" aria-hidden="true" />
        教育背景
      </h2>
      <div className="mt-8 max-w-3xl">
        {profile.education.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {profile.education.map((edu, index) => (
              <Card key={index}>
                <p className="text-sm font-medium text-muted">{edu.period}</p>
                <h3 className="mt-1 text-lg font-semibold">{edu.school}</h3>
                {edu.degree && <p className="mt-1 text-sm text-accent">{edu.degree}</p>}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted">暂无教育背景。</p>
        )}
      </div>
    </section>
  )
}

/** 加载中骨架屏 */
function AboutSkeleton() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-surface" />
      <div className="mt-6 h-24 max-w-3xl animate-pulse rounded-lg bg-surface" />
      <div className="mt-16 h-8 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 max-w-3xl space-y-6">
        <div className="h-28 animate-pulse rounded-card bg-surface" />
        <div className="h-28 animate-pulse rounded-card bg-surface" />
      </div>
      <div className="mt-16 h-8 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-card bg-surface" />
        <div className="h-24 animate-pulse rounded-card bg-surface" />
      </div>
    </section>
  )
}

/** 空状态引导 */
function AboutEmpty() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">关于我</h1>
      <p className="mt-6 text-muted">个人信息尚未配置，请前往后台完善。</p>
      <Link to="/admin/login" className="mt-6 inline-block text-accent hover:underline">
        前往后台
      </Link>
    </section>
  )
}
