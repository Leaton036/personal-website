import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, CircleAlert, CircleCheck, GraduationCap, LoaderCircle, Plus, Save, Trash } from 'lucide-react'
import { getProfile, updateProfile } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { Profile } from '@/types'

const socialSchema = z.object({
  platform: z.string().trim().min(1, '请输入平台名'),
  url: z.string().trim().min(1, '请输入链接'),
})
const experienceSchema = z.object({
  company: z.string().trim().min(1, '请输入公司名'),
  role: z.string().trim().min(1, '请输入职位'),
  period: z.string().trim().min(1, '请输入时间段'),
  desc: z.string().trim(),
})
const educationSchema = z.object({
  school: z.string().trim().min(1, '请输入学校名'),
  degree: z.string().trim(),
  period: z.string().trim(),
})
const profileSchema = z.object({
  name: z.string().trim().min(1, '请输入姓名'),
  title: z.string().trim().min(1, '请输入职位'),
  avatar: z.string().trim(),
  bio: z.string().trim(),
  email: z.string().trim().min(1, '请输入邮箱').pipe(z.email('邮箱格式不正确')),
  social: z.array(socialSchema),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const emptyProfile: ProfileFormValues = {
  name: '',
  title: '',
  avatar: '',
  bio: '',
  email: '',
  social: [],
  experiences: [],
  education: [],
}

/** 后台个人信息管理 */
export default function AdminProfile() {
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) })

  const socialFields = useFieldArray({ control, name: 'social' })
  const experienceFields = useFieldArray({ control, name: 'experiences' })
  const educationFields = useFieldArray({ control, name: 'education' })

  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((profile) => {
        if (cancelled) return
        reset(profile ?? emptyProfile)
      })
      .catch(() => {
        if (!cancelled) reset(emptyProfile)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reset])

  const onSubmit = async (data: ProfileFormValues) => {
    setFeedback('idle')
    try {
      await updateProfile(data as Profile)
      setFeedback('success')
    } catch {
      setFeedback('error')
    }
  }

  if (loading) return <ProfileSkeleton />

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">个人信息</h1>
          <p className="mt-2 text-sm text-muted">编辑个人简介、经历与教育背景，保存后前台同步更新。</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {isSubmitting ? '保存中…' : '保存'}
        </Button>
      </div>

      {feedback === 'success' && (
        <p role="status" className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          <CircleCheck size={16} aria-hidden="true" />
          保存成功。
        </p>
      )}
      {feedback === 'error' && (
        <p role="alert" className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <CircleAlert size={16} aria-hidden="true" />
          保存失败，请稍后重试。
        </p>
      )}

      {/* 基本信息 */}
      <section className="rounded-card border border-border bg-surface/60 p-6">
        <h2 className="text-base font-semibold">基本信息</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input label="姓名" error={errors.name?.message} {...register('name')} />
          <Input label="职位" error={errors.title?.message} {...register('title')} />
          <Input label="邮箱" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="头像地址" placeholder="https://…" error={errors.avatar?.message} {...register('avatar')} />
        </div>
        <div className="mt-4">
          <Textarea label="简介" rows={4} error={errors.bio?.message} {...register('bio')} />
        </div>
      </section>

      {/* 社交链接 */}
      <section className="rounded-card border border-border bg-surface/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">社交链接</h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => socialFields.append({ platform: '', url: '' })}>
            <Plus size={14} aria-hidden="true" />
            添加
          </Button>
        </div>
        {socialFields.fields.length === 0 ? (
          <p className="mt-4 text-sm text-muted">暂无社交链接，点击「添加」新增。</p>
        ) : (
          <div className="mt-5 space-y-4">
            {socialFields.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-start">
                <div className="flex-1 space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
                  <Input
                    label="平台"
                    placeholder="GitHub"
                    error={errors.social?.[index]?.platform?.message}
                    {...register(`social.${index}.platform`)}
                  />
                  <Input
                    label="链接"
                    placeholder="https://…"
                    error={errors.social?.[index]?.url?.message}
                    {...register(`social.${index}.url`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => socialFields.remove(index)}
                  className="mt-1 self-start rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-red-400"
                  aria-label={`删除社交链接 ${index + 1}`}
                >
                  <Trash size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 工作经历 */}
      <section className="rounded-card border border-border bg-surface/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Briefcase size={16} className="text-accent" aria-hidden="true" />
            工作经历
          </h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => experienceFields.append({ company: '', role: '', period: '', desc: '' })}>
            <Plus size={14} aria-hidden="true" />
            添加
          </Button>
        </div>
        {experienceFields.fields.length === 0 ? (
          <p className="mt-4 text-sm text-muted">暂无工作经历，点击「添加」新增。</p>
        ) : (
          <div className="mt-5 space-y-4">
            {experienceFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border/60 p-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted">经历 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => experienceFields.remove(index)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-red-400"
                    aria-label={`删除经历 ${index + 1}`}
                  >
                    <Trash size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Input label="公司" error={errors.experiences?.[index]?.company?.message} {...register(`experiences.${index}.company`)} />
                  <Input label="职位" error={errors.experiences?.[index]?.role?.message} {...register(`experiences.${index}.role`)} />
                  <Input label="时间段" placeholder="2024 - 至今" error={errors.experiences?.[index]?.period?.message} {...register(`experiences.${index}.period`)} />
                </div>
                <div className="mt-3">
                  <Textarea label="描述" rows={2} error={errors.experiences?.[index]?.desc?.message} {...register(`experiences.${index}.desc`)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 教育背景 */}
      <section className="rounded-card border border-border bg-surface/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <GraduationCap size={16} className="text-accent" aria-hidden="true" />
            教育背景
          </h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => educationFields.append({ school: '', degree: '', period: '' })}>
            <Plus size={14} aria-hidden="true" />
            添加
          </Button>
        </div>
        {educationFields.fields.length === 0 ? (
          <p className="mt-4 text-sm text-muted">暂无教育背景，点击「添加」新增。</p>
        ) : (
          <div className="mt-5 space-y-4">
            {educationFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border/60 p-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted">教育 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => educationFields.remove(index)}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-red-400"
                    aria-label={`删除教育背景 ${index + 1}`}
                  >
                    <Trash size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Input label="学校" error={errors.education?.[index]?.school?.message} {...register(`education.${index}.school`)} />
                  <Input label="学位" error={errors.education?.[index]?.degree?.message} {...register(`education.${index}.degree`)} />
                  <Input label="时间段" placeholder="2017 - 2021" error={errors.education?.[index]?.period?.message} {...register(`education.${index}.period`)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </form>
  )
}

/** 加载中骨架屏 */
function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface" />
        <div className="h-10 w-20 animate-pulse rounded-xl bg-surface" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-card bg-surface" />
      ))}
    </div>
  )
}
