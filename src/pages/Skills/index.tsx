import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Atom,
  Braces,
  Boxes,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  Palette,
  PenTool,
  Server,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getSkills } from '@/api'
import type { Skill } from '@/types'

/** icon 名称 → lucide 图标映射（新增技能图标时在此扩展） */
const ICON_MAP: Record<string, LucideIcon> = {
  atom: Atom,
  braces: Braces,
  boxes: Boxes,
  cloud: Cloud,
  code: Code2,
  container: Container,
  cpu: Cpu,
  database: Database,
  git: GitBranch,
  'git-branch': GitBranch,
  globe: Globe,
  layers: Layers,
  palette: Palette,
  'pen-tool': PenTool,
  server: Server,
  terminal: Terminal,
  wrench: Wrench,
  zap: Zap,
}

/** 判断 icon 是否为 emoji */
function isEmoji(value: string): boolean {
  return /\p{Extended_Pictographic}/u.test(value)
}

/** 技能图标：优先匹配 lucide 图标，emoji 直接显示，未知图标回退为通用代码图标 */
function SkillIcon({ icon }: { icon: string }) {
  const MappedIcon = ICON_MAP[icon]
  if (MappedIcon) return <MappedIcon className="h-5 w-5" aria-hidden="true" />
  if (isEmoji(icon)) {
    return (
      <span className="text-lg leading-none" aria-hidden="true">
        {icon}
      </span>
    )
  }
  return <Code2 className="h-5 w-5" aria-hidden="true" />
}

/** 熟练度进度条：挂载后从 0 过渡到实际值（transition-all 过渡动画） */
function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value))
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(safeValue))
    return () => cancelAnimationFrame(id)
  }, [safeValue])

  return (
    <div className="h-2 overflow-hidden rounded-full bg-border/60">
      <div
        className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
        aria-hidden="true"
      />
    </div>
  )
}

/** 技能卡片 */
function SkillCard({ skill }: { skill: Skill }) {
  const level = Math.max(0, Math.min(100, skill.level))
  return (
    <div className="rounded-card border border-border bg-surface/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <SkillIcon icon={skill.icon} />
        </div>
        <span className="font-medium">{skill.name}</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>熟练度</span>
          <span>{level}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={level} />
        </div>
      </div>
    </div>
  )
}

/** 按 category 分组，保持分类首次出现顺序 */
function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const map = new Map<string, Skill[]>()
  for (const skill of skills) {
    const category = skill.category || '其他'
    const list = map.get(category)
    if (list) list.push(skill)
    else map.set(category, [skill])
  }
  return Array.from(map.entries())
}

/** 技能展示页 */
export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getSkills()
      .then((data) => {
        if (!cancelled) setSkills(data)
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

  if (loading) return <SkillsSkeleton />
  if (skills.length === 0) return <SkillsEmpty />

  const groups = groupByCategory(skills)

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">技能</h1>
      <p className="mt-3 text-muted">我掌握的技术栈与熟练度。</p>

      {groups.map(([category, list]) => (
        <div key={category} className="mt-12">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{category}</h2>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-accent">
              {list.length}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

/** 加载中骨架屏 */
function SkillsSkeleton() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <div className="h-9 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-3 h-5 w-64 animate-pulse rounded-lg bg-surface" />
      {[0, 1].map((group) => (
        <div key={group} className="mt-12">
          <div className="h-7 w-24 animate-pulse rounded-lg bg-surface" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-card bg-surface" />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

/** 空状态引导 */
function SkillsEmpty() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">技能</h1>
      <p className="mt-6 text-muted">技能数据尚未配置，请前往后台添加。</p>
      <Link to="/admin/login" className="mt-6 inline-block text-accent hover:underline">
        前往后台
      </Link>
    </section>
  )
}
