import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  Copy,
  Globe,
  LoaderCircle,
  Mail,
  Send,
} from 'lucide-react'
import { getProfile } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { Profile } from '@/types'

// 联系表单校验规则
const contactSchema = z.object({
  name: z.string().trim().min(1, '请输入姓名'),
  email: z.string().trim().min(1, '请输入邮箱').pipe(z.email('邮箱格式不正确')),
  message: z.string().trim().min(10, '留言至少 10 个字'),
})

type ContactFormValues = z.infer<typeof contactSchema>

/** 模拟提交（本期不接后端） */
function mockSend(_values: ContactFormValues): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600))
}

/** 联系表单 */
function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('idle')
    try {
      await mockSend(values)
      reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-card border border-border bg-surface/60 p-6"
    >
      <h2 className="text-lg font-semibold">给我留言</h2>
      <p className="mt-1 text-sm text-muted">填写以下信息，我会尽快回复。</p>

      <div className="mt-6 space-y-4">
        <Input
          label="姓名"
          placeholder="你的名字"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="邮箱"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Textarea
          label="留言内容"
          placeholder="想说的话…（至少 10 个字）"
          rows={5}
          error={errors.message?.message}
          {...register('message')}
        />
      </div>

      {status === 'success' && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400"
        >
          <CircleCheck size={16} aria-hidden="true" />
          发送成功，感谢你的留言！
        </p>
      )}
      {status === 'error' && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
        >
          <CircleAlert size={16} aria-hidden="true" />
          发送失败，请稍后重试。
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
        {isSubmitting ? (
          <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Send size={16} aria-hidden="true" />
        )}
        {isSubmitting ? '发送中…' : '发送留言'}
      </Button>
    </form>
  )
}

/** 联系页 */
export default function Contact() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | undefined>(undefined)

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

  // 组件卸载时清理复制提示定时器
  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    }
  }, [])

  const handleCopy = async () => {
    if (!profile?.email) return
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // 剪贴板 API 不可用时回退方案
      const textarea = document.createElement('textarea')
      textarea.value = profile.email
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <ContactSkeleton />

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold">联系我</h1>
      <p className="mt-3 text-muted">有问题或合作意向，欢迎通过以下方式联系。</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* 左栏：邮箱 + 社交链接 */}
        <div>
          <h2 className="text-lg font-semibold">邮箱</h2>
          {profile?.email ? (
            <div className="mt-3 flex items-center gap-3 rounded-card border border-border bg-surface/60 p-4">
              <Mail size={18} className="shrink-0 text-accent" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm">{profile.email}</span>
              <Button variant="secondary" size="sm" onClick={handleCopy} aria-label="复制邮箱地址">
                {copied ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
                {copied ? '已复制' : '复制'}
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">邮箱尚未配置，请前往后台完善。</p>
          )}

          <h2 className="mt-10 text-lg font-semibold">社交链接</h2>
          {profile && profile.social.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {profile.social.map((item, index) => (
                <li key={`${item.platform}-${index}`}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-card border border-border bg-surface/60 p-4 transition-colors hover:border-accent/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Globe size={18} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium">{item.platform}</span>
                    <ArrowUpRight
                      size={16}
                      className="ml-auto text-muted transition-colors group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              暂无社交链接。
              <Link to="/admin/login" className="ml-1 text-accent hover:underline">
                前往后台
              </Link>
            </p>
          )}
        </div>

        {/* 右栏：联系表单 */}
        <ContactForm />
      </div>
    </section>
  )
}

/** 加载中骨架屏 */
function ContactSkeleton() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <div className="h-9 w-32 animate-pulse rounded-lg bg-surface" />
      <div className="mt-3 h-5 w-64 animate-pulse rounded-lg bg-surface" />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-6 w-16 animate-pulse rounded bg-surface" />
          <div className="h-16 animate-pulse rounded-card bg-surface" />
          <div className="h-6 w-24 animate-pulse rounded bg-surface" />
          <div className="h-16 animate-pulse rounded-card bg-surface" />
        </div>
        <div className="h-96 animate-pulse rounded-card bg-surface" />
      </div>
    </section>
  )
}
