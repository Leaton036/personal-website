import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { login } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  username: z.string().trim().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

type LoginFormValues = z.infer<typeof loginSchema>

/** 后台登录页 */
export default function Login() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('')
    try {
      await login(data.username, data.password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : '登录失败，请稍后重试')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-card border border-border bg-surface/60 p-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-text">管理员登录</h1>
          <p className="mt-1 text-sm text-muted">请输入账号密码进入后台</p>
        </div>

        {serverError && (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            <CircleAlert size={16} aria-hidden="true" />
            {serverError}
          </p>
        )}

        <Input
          label="用户名"
          autoComplete="username"
          placeholder="admin"
          error={errors.username?.message}
          {...register('username')}
        />
        <Input
          label="密码"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          ) : null}
          {isSubmitting ? '登录中…' : '登录'}
        </Button>
      </form>
    </div>
  )
}
