import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CircleAlert, CircleCheck, LoaderCircle, Save } from 'lucide-react'
import { getSettings, updateSettings } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { SiteSettings } from '@/types'

const settingsSchema = z.object({
  siteName: z.string().trim().min(1, '请输入站点名称'),
  accentColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, '请输入合法的十六进制颜色（如 #3B82F6）'),
  footerText: z.string().trim(),
  icp: z.string().trim(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

/** 后台站点设置 */
export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema) })

  const accentColor = watch('accentColor')

  useEffect(() => {
    let cancelled = false
    getSettings()
      .then((settings) => {
        if (cancelled) return
        reset({
          siteName: settings.siteName,
          accentColor: settings.accentColor,
          footerText: settings.footerText,
          icp: settings.icp ?? '',
        })
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reset])

  const onSubmit = async (data: SettingsFormValues) => {
    setFeedback('idle')
    try {
      const payload: SiteSettings = {
        siteName: data.siteName,
        accentColor: data.accentColor,
        footerText: data.footerText,
        icp: data.icp || undefined,
      }
      await updateSettings(payload)
      setFeedback('success')
    } catch {
      setFeedback('error')
    }
  }

  if (loading) return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-card bg-surface" />

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">站点设置</h1>
          <p className="mt-2 text-sm text-muted">站点名称、强调色与页脚文字，保存后前台同步更新。</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {isSubmitting ? '保存中…' : '保存'}
        </Button>
      </div>

      {feedback === 'success' && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          <CircleCheck size={16} aria-hidden="true" />
          保存成功，前台已同步更新。
        </p>
      )}
      {feedback === 'error' && (
        <p role="alert" className="mt-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <CircleAlert size={16} aria-hidden="true" />
          保存失败，请稍后重试。
        </p>
      )}

      <div className="mt-6 space-y-6 rounded-card border border-border bg-surface/60 p-6">
        <Input label="站点名称" error={errors.siteName?.message} {...register('siteName')} />

        <div>
          <label htmlFor="accent-color" className="text-sm text-muted">
            强调色
          </label>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              id="accent-color"
              type="color"
              className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-surface p-1"
              {...register('accentColor')}
            />
            <span className="text-sm text-muted">{accentColor}</span>
          </div>
          {errors.accentColor && <p className="mt-1 text-sm text-red-400">{errors.accentColor.message}</p>}
        </div>

        <Textarea label="页脚文字" rows={2} error={errors.footerText?.message} {...register('footerText')} />
        <Input label="ICP 备案号（可选）" placeholder="京ICP备XXXXXXXX号" error={errors.icp?.message} {...register('icp')} />
      </div>
    </form>
  )
}
